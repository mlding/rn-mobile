import { Actions } from 'react-native-router-flux'
import {
  isEmpty,
  map,
  omit,
  pick,
  has,
  chain,
  filter,
  get,
  includes,
  findIndex,
  isFinite,
  differenceWith,
  toLower,
  isNil,
  intersectionWith,
  capitalize,
  isEqual,
} from 'lodash'
import RNFS from 'react-native-fs'
import { getQuantityUnit } from '../work-item/utilities'
import { isConstructionManager, isLeadWorker } from '../utilities/role'
import { getAllDraftReportPictures } from '../draft/utilities'
import { DEFAULT_SORT_TYPE } from './constants'
import { IMAGE_FOLDER } from '../constants/download'
import STATUS, { ORDERING, ORDERING_BY_STATUS, READ_ONLY_STATUS_FOR_LEAD_WORKER } from '../constants/status'

// when the quantity is new added, should do some filter to the request parameter
const convertQuantityToSubmittedData = quantity => {
  if (quantity.id) {
    return quantity
  }
  return {
    ...pick(quantity,
      ['work_item_quantity',
        'quantity_description',
        'estimated_quantity',
        'quantity',
        'remaining_quantity',
        'material',
        'is_primary_quantity',
      ]),
  }
}

export const getUploadedPicture = (productionLine, allUploadedPictures) => {
  const existPictures = filter(productionLine.pictures, picture => picture.id)
  if (!productionLine.is_active) {
    return existPictures
  }

  const uploadedPictures = chain(allUploadedPictures)
    .filter(picture => picture.workItemId === productionLine.work_item)
    .map('picture')
    .value()

  return [...existPictures, ...uploadedPictures]
}

// when the production line is new added, should do some filter to the request parameter
export const convertReportLineToSubmittedData = (productionLine, allUploadedPictures = []) => {
  let omitParameter = ['quantities', 'pictures']
  if (!productionLine.id) {
    omitParameter = ['activity_code', 'work_item_descriptor', 'quantities', 'requires_photo', 'network_operator']
  }
  return {
    ...omit(productionLine, omitParameter),
    quantities: map(productionLine.quantities, quantity =>
      convertQuantityToSubmittedData(quantity)),
    network_element: {
      ...productionLine.network_element,
      as_built_annotations: map(get(productionLine, 'network_element.as_built_annotations'), item => {
        // as_built_requirements
        if (has(item, 'element_category')) {
          return omit(item, ['id', 'element_category'])
        }
        // as_built_annotations
        return item
      }),
    },
    pictures: getUploadedPicture(productionLine, allUploadedPictures),
  }
}

export const retrieveUploadPictures = (productionLines, uploadedPictureUUIds) => (
  chain(productionLines)
    .filter(productionLine => productionLine.is_active)
    .map('pictures')
    .flatten()
    .filter(picture => picture.uuid && !includes(uploadedPictureUUIds, picture.uuid))
    .value()
)

export const isRequiredPhotoEmpty = productReportLines => (
  findIndex(productReportLines, reportLine => (
    reportLine.work_item_completed
    && reportLine.requires_photo
    && reportLine.pictures.length === 0
  )) >= 0
)

export const isQuantityFieldEmpty = productReportLines => {
  const isQuantityFieldInvalidate = quantity =>
  !isFinite(quantity.quantity) || !isFinite(quantity.remaining_quantity)

  return findIndex(productReportLines, reportLine =>
      (reportLine.quantities.findIndex(isQuantityFieldInvalidate) >= 0)) >= 0
}

export const getCurrentLocation = () => (
  new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(position => {
      const coords = position.coords
      const location = {
        longitude: coords.longitude,
        latitude: coords.latitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        timestamp: position.timestamp,
      }
      resolve(location)
    },
    err => {
      console.log('get current location error ', err) //eslint-disable-line
      resolve(null)
    }, {
      timeout: 5000,
    })
  })
)

const MAX_QUANTITY_FIELD_WIDTH = 120
const MAX_QUANTITY_NAME_LENGTH = 23

/**
 * First get quantity name. if `quantityValue.material_name` not null set it to quantity name
 * else, set `quantityValue.material_name` to quantity name
 *
 * Then cut the quantity name.
 * for example, if quantity name: "ASW-ff2-3231-2323", quantity unit: "each",
 * we should display name `ASW-ff2-3231-2323 (each)`.
 * However, if quantity name is too long to the quantity text field,
 * it should be cut to `ASW-ff2-3231... (each)`
 * We suppose `MAX_QUANTITY_FIELD_WIDTH` could hold max text length `MAX_QUANTITY_NAME_LENGTH`.
 *
 * The real quantity field width maybe different in devices, real max text length could be
 * calculated according to the `quantityFieldWidth`.
 *
 */
export const buildQuantityNameText =
  (quantityValue, quantityFieldWidth = MAX_QUANTITY_FIELD_WIDTH) => {
    if (quantityFieldWidth === 0) {
      return ''
    }
    const name = isEmpty(quantityValue.material_name) ?
        quantityValue.quantity_description_name : quantityValue.material_name
    const unit = getQuantityUnit(quantityValue)
    if (isEmpty(name)) {
      return `(${unit})`
    }
    const quantityMaxLength = (Math.min(MAX_QUANTITY_FIELD_WIDTH, quantityFieldWidth) *
    MAX_QUANTITY_NAME_LENGTH) / MAX_QUANTITY_FIELD_WIDTH
    const nameMaxLength = quantityMaxLength - unit.length
    if (name.length <= nameMaxLength) {
      return `${name} (${unit})`
    }
    return `${name.substring(0, nameMaxLength - 2)}... (${unit})`
  }

export const getListRequestParameters = (user, sortType) => {
  let params = {}
  const { role, id } = user
  if (isLeadWorker(role)) {
    params = {
      created_by: id,
      ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      ordering: ORDERING.SUBMITTED_DATE,
    }
  } else if (isConstructionManager(role)) {
    params = {
      approver: id,
      ordering_by_status: ORDERING_BY_STATUS.CONSTRUCTION_MANAGER,
      ordering: '-reported_date',
    }
  }

  if (sortType === DEFAULT_SORT_TYPE) {
    return params
  }

  return omit(params, ['ordering_by_status'])
}

export const cleanUnUsedPictures = () => (
  RNFS.exists(IMAGE_FOLDER)
    .then(isExist => {
      if (isExist) {
        return Promise.resolve()
      }
      return Promise.reject()
    })
    .then(() => getAllDraftReportPictures())
    .then(draftPictures => {
      if (isEmpty(draftPictures)) {
        return RNFS.unlink(IMAGE_FOLDER)
      }
      return RNFS.readDir(IMAGE_FOLDER).then(allPictures => {
        const deletePictures = differenceWith(allPictures, draftPictures,
          (picture, draftPicture) => picture.name === draftPicture)

        return Promise.all(map(deletePictures, picture => (RNFS.unlink(picture.path))))
      })
    })
)

export const getMaterialDescription = material => material.alias || ''

export const getFilterData = (materials, reportLine, quantity, searchTxt) => {
  const lowerSearchTxt = toLower(searchTxt)
  return filter(materials, item => (
    !isNil(item.quantity_description) &&
    getMaterialDescription(item).toLowerCase().includes(lowerSearchTxt) &&
    reportLine.network_operator === item.network_operator &&
    (!quantity || quantity.material_category === item.material_category)))
}


export const getActiveReportLines = reportLines =>
  filter(reportLines, 'is_active')

export const getWorkItemsFromReportLines = (workItemList, reportLines) => {
  const activeReportLines = getActiveReportLines(reportLines)
  return intersectionWith(workItemList, activeReportLines, (workItem, reportLine) =>
    workItem.id === reportLine.work_item)
}

export const openReportDetail = (item, role) => {
  if (isLeadWorker(role)) {
    const formatStatus = capitalize(item.status)
    if (READ_ONLY_STATUS_FOR_LEAD_WORKER.includes(formatStatus)) {
      Actions.reportDetail({ reportDetailData: item })
    } else if (isEqual(STATUS.FLAGGED, formatStatus)) {
      Actions.editReport({ reportDetailData: item })
    }
  } else if (isConstructionManager(role)) {
    Actions.managerReportDetail({ reportDetailData: item })
  }
}
