import { map, omit } from 'lodash'
import RNFS from 'react-native-fs'
import { Actions } from 'react-native-router-flux'
import {
  convertReportLineToSubmittedData,
  retrieveUploadPictures,
  getUploadedPicture,
  isRequiredPhotoEmpty,
  isQuantityFieldEmpty,
  getListRequestParameters,
  cleanUnUsedPictures,
  getFilterData,
  getMaterialDescription,
  getWorkItemsFromReportLines,
  getActiveReportLines,
  openReportDetail,
} from '../utilities'
import reportDetailData, {
  reportLine, reportLineSubmittedData, reportLineSubmittedDataWithoutQuantityId,
  reportLineSubmittedDataWithoutId, reportLineAsBuiltData, workItemlist, workItems,
  workItem, productionlLine, productionlLines, productionlLineWrongId, activeProductionlLines,
  noActiveProductionlLines, mixProductionlLines,
} from '../fixture'
import { constructionManager, leadWorker } from '../../shared/fixture'
import { getAllDraftReportPictures } from '../../draft/utilities'
import { ORDERING, ORDERING_BY_STATUS } from '../../constants/status'
import ROLE from '../../constants/role'

jest.mock('react-native-router-flux', () => ({
  Actions: {
    reportDetail: jest.fn(),
    editReport: jest.fn(),
    managerReportDetail: jest.fn(),
  },
}))

jest.mock('react-native-fs', () => ({
  exists: () => (Promise.resolve(true)),
  unlink: jest.fn(),
  readDir: () => (
    Promise.resolve([
      { path: '1.jpg', name: '1.jpg' },
      { path: '2.jpg', name: '2.jpg' },
      { path: '3.jpg', name: '3.jpg' },
    ])
  ),
}))

jest.mock('../../draft/utilities', () => ({
  getAllDraftReportPictures: jest.fn(),
}))

jest.mock('../../constants/download', () => ({
  IMAGE_FOLDER: 'downloadImages/',
}))

describe('report utilities helper', () => {
  describe('#convertReportLineToSubmittedData', () => {
    it('should omit the activity_code, work_item_descriptor when the report line not have id', () => {
      expect(convertReportLineToSubmittedData(omit(reportLine, ['id']))).toEqual(reportLineSubmittedDataWithoutId)
    })

    it('should not omit value when the report line have id', () => {
      expect(convertReportLineToSubmittedData(reportLine)).toEqual(reportLineSubmittedData)
    })

    it('should not omit value when the report line have id but quantity not have id', () => {
      const reportLineWithoutQuantityId = {
        ...omit(reportLine, ['quantities']),
        quantities: map(reportLine.quantities, quantity => omit(quantity, ['id'])),
      }
      expect(convertReportLineToSubmittedData(reportLineWithoutQuantityId))
        .toEqual(reportLineSubmittedDataWithoutQuantityId)
    })

    it('should not omit value when the report line have id and quantity have id', () => {
      const reportLineWithId = {
        ...omit(reportLineAsBuiltData, ['quantities']),
        quantities: map(reportLineAsBuiltData.quantities, (quantity, index) =>
          ({ ...quantity, id: index + 1 })),
      }
      expect(convertReportLineToSubmittedData(reportLineWithId))
        .toEqual(reportLineWithId)
    })

    it('should not omit id when As Built comes from as_built_requirements', () => {
      expect(convertReportLineToSubmittedData(reportLine)).toEqual(reportLineAsBuiltData)
    })
  })

  describe('#getUploadedPicture', () => {
    const reportLineWithPicture = {
      work_item: 1,
      is_active: true,
      pictures: [{ id: 1 }, { id: 2 }, { uuid: 1 }, { uuid: 2 }],
    }

    const uploadedPictures = [{
      workItemId: 1,
      picture: {
        id: 3,
      },
    }, {
      workItemId: 2,
      picture: {
        id: 4,
      },
    }]

    it('should not add the upload picture to report line when the report line in_active is false', () => {
      const productionLine = { ...reportLineWithPicture, is_active: false }
      const pictures = getUploadedPicture(productionLine, uploadedPictures)
      expect(pictures.length).toEqual(2)
      expect(pictures).toEqual([{ id: 1 }, { id: 2 }])
    })

    it('should add the upload picture to report line when the report line  in_active is true', () => {
      const pictures = getUploadedPicture(reportLineWithPicture, uploadedPictures)
      expect(pictures.length).toEqual(3)
      expect(pictures).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })

    it('should not add the upload picture to report line when there is no uploaded picture matches', () => {
      const productionLine = { ...reportLineWithPicture, work_item: 3 }
      const pictures = getUploadedPicture(productionLine, uploadedPictures)
      expect(pictures.length).toEqual(2)
      expect(pictures).toEqual([{ id: 1 }, { id: 2 }])
    })
  })

  describe('#retrieveUploadPictures', () => {
    const activeProductionLine = {
      is_active: true,
      pictures: [{ uuid: 1 }, { uuid: 12 }, { id: 1 }],
    }

    const unActiveProductionLine = {
      is_active: false,
      pictures: [{ uuid: 2 }, { id: 2 }],
    }

    it('should get all active production lines unupload pictures', () => {
      const uploadPicture =
        retrieveUploadPictures([activeProductionLine, unActiveProductionLine], [])

      expect(uploadPicture.length).toEqual(2)
      expect(uploadPicture).toEqual([{ uuid: 1 }, { uuid: 12 }])
    })

    it('should get the active production lines not include the already uploaded ', () => {
      const uploadPicture =
        retrieveUploadPictures([activeProductionLine, unActiveProductionLine], [1])

      expect(uploadPicture.length).toEqual(1)
      expect(uploadPicture[0]).toEqual({ uuid: 12 })
    })
  })

  describe('#isRequiredPhotoEmpty', () => {
    it('should return true when the work_item_completed is checked, and requires_photo is true and no image upload for one production line', () => {
      const checkReportLines = [
        {
          ...reportLine,
          work_item_completed: false,
          requires_photo: true,
          pictures: [],
        },
        {
          ...reportLine,
          work_item_completed: true,
          requires_photo: true,
          pictures: [],
        },
      ]
      expect(isRequiredPhotoEmpty(checkReportLines)).toEqual(true)
    })

    it('should return false when the work_item_completed is unchecked', () => {
      const checkReportLines = [
        {
          ...reportLine,
          work_item_completed: false,
          requires_photo: true,
          pictures: [],
        },
        {
          ...reportLine,
          work_item_completed: false,
          requires_photo: true,
          pictures: [],
        },
      ]
      expect(isRequiredPhotoEmpty(checkReportLines)).toEqual(false)
    })

    it('should return false when the requires_photo is false', () => {
      const checkReportLines = [
        {
          ...reportLine,
          work_item_completed: false,
          requires_photo: true,
          pictures: [],
        },
        {
          ...reportLine,
          work_item_completed: true,
          requires_photo: false,
          pictures: [],
        },
      ]
      expect(isRequiredPhotoEmpty(checkReportLines)).toEqual(false)
    })

    it('should return false when the pictures is not empty', () => {
      const checkReportLines = [
        {
          ...reportLine,
          work_item_completed: false,
          requires_photo: true,
          pictures: [],
        },
        {
          ...reportLine,
          work_item_completed: true,
          requires_photo: true,
          pictures: [{ id: 1 }],
        },
      ]
      expect(isRequiredPhotoEmpty(checkReportLines)).toEqual(false)
    })
  })

  describe('#isQuantityFieldEmpty', () => {
    const quantities = [
      { id: 1, quantity: 12, remaining_quantity: 12 },
      { id: 2, quantity: 3, remaining_quantity: 3 },
    ]
    it('should return true when the quantity is null', () => {
      const checkReportLines = [
        {
          ...reportLine,
          quantities: [...quantities],
        },
        {
          ...reportLine,
          quantities: [...quantities, { id: 3, quantity: null, remaining_quantity: 3 }],
        },
      ]
      expect(isQuantityFieldEmpty(checkReportLines)).toEqual(true)
    })

    it('should return true when the remain quantity is null', () => {
      const checkReportLines = [
        {
          ...reportLine,
          quantities: [...quantities],
        },
        {
          ...reportLine,
          quantities: [...quantities, { id: 3, quantity: 1, remaining_quantity: null }],
        },
      ]
      expect(isQuantityFieldEmpty(checkReportLines)).toEqual(true)
    })

    it('should return true when the quantity is string', () => {
      const checkReportLines = [
        {
          ...reportLine,
          quantities: [...quantities],
        },
        {
          ...reportLine,
          quantities: [...quantities, { id: 3, quantity: 'hello', remaining_quantity: 2 }],
        },
      ]
      expect(isQuantityFieldEmpty(checkReportLines)).toEqual(true)
    })

    it('should return true when the remaining quantity is string', () => {
      const checkReportLines = [
        {
          ...reportLine,
          quantities: [...quantities],
        },
        {
          ...reportLine,
          quantities: [...quantities, { id: 3, quantity: 3, remaining_quantity: 'hello' }],
        },
      ]
      expect(isQuantityFieldEmpty(checkReportLines)).toEqual(true)
    })

    it('should return false when the quantity and remain quantity are exist and is number', () => {
      const checkReportLines = [
        {
          ...reportLine,
          quantities: [...quantities],
        },
        {
          ...reportLine,
          quantities: [...quantities],
        },
      ]
      expect(isQuantityFieldEmpty(checkReportLines)).toEqual(false)
    })
  })

  describe('#cleanUnUsedPictures', () => {
    it('should delete the all folder when there is no draftReport report', () => {
      getAllDraftReportPictures.mockReturnValueOnce(Promise.resolve([]))

      return cleanUnUsedPictures().then(() => {
        expect(RNFS.unlink).toBeCalledWith('downloadImages/')
      })
    })

    it('should delete the file not in draftReport pictures', () => {
      getAllDraftReportPictures.mockReturnValueOnce(Promise.resolve(['1.jpg', '2.jpg']))

      return cleanUnUsedPictures(reportDetailData).then(() => {
        expect(RNFS.unlink).toBeCalledWith('3.jpg')
        expect(RNFS.unlink).not.toBeCalledWith('1.jpg')
        expect(RNFS.unlink).not.toBeCalledWith('2.jpg')
      })
    })
  })

  describe('#getListRequestParameters', () => {
    const leaderWorkParameter = {
      created_by: leadWorker.id,
      ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      ordering: ORDERING.SUBMITTED_DATE,
    }

    const construnctionManagerParameter = {
      approver: constructionManager.id,
      ordering_by_status: ORDERING_BY_STATUS.CONSTRUCTION_MANAGER,
      ordering: '-reported_date',
    }
    it('should get the parameter with status when sortType is status for leader worker', () => {
      const params = getListRequestParameters(leadWorker, 'status')
      expect(params).toEqual(leaderWorkParameter)
    })

    it('should get the parameter with status when sortType is status for construction manager', () => {
      const params = getListRequestParameters(constructionManager, 'status')
      expect(params).toEqual(construnctionManagerParameter)
    })

    it('should get the parameter with status when sortType is date for leader worker', () => {
      const params = getListRequestParameters(leadWorker, 'date')
      expect(params).toEqual(omit(leaderWorkParameter, ['ordering_by_status']))
    })

    it('should get the parameter with status when sortType is date for construction manager', () => {
      const params = getListRequestParameters(constructionManager, 'date')
      expect(params).toEqual(omit(construnctionManagerParameter, ['ordering_by_status']))
    })
  })

  describe('#getMaterialDescription', () => {
    it('should get material description when alias is null', () => {
      expect(getMaterialDescription({})).toEqual('')
    })
    it('should get material description when alias is present', () => {
      expect(getMaterialDescription({ alias: 'material_alias' })).toEqual('material_alias')
    })
  })

  describe('#getFilterData', () => {
    it('should filter item when material quantity_description is empty', () => {
      const inputReportLine = { network_operator: 13 }
      const inputMaterials = [
        { quantity_description: 1, network_operator: 13 },
        { quantity_description: 2, network_operator: 13, alias: 'AB' },
        { network_operator: 13 }]
      const res = getFilterData(inputMaterials, inputReportLine, null, '')
      expect(res.length).toEqual(2)
    })

    it('should filter item when material network_operator is not match', () => {
      const inputReportLine = { network_operator: 13 }
      const inputMaterials = [
        { quantity_description: 1, network_operator: 13 },
        { quantity_description: 2, network_operator: 14, alias: 'AB' }]
      const res = getFilterData(inputMaterials, inputReportLine, null, '')
      expect(res.length).toEqual(1)
    })

    it('should filter item when material material_category is not match', () => {
      const inputReportLine = { network_operator: 13 }
      const inputQuantity = { material_category: 7 }
      const inputMaterials = [
        { quantity_description: 1, network_operator: 13, material_category: 7 },
        { quantity_description: 1, network_operator: 13, material_category: 6 },
        { quantity_description: 2, network_operator: 14, material_category: 7, alias: 'AB' }]
      const res = getFilterData(inputMaterials, inputReportLine, inputQuantity, '')
      expect(res.length).toEqual(1)
    })

    it('should filter item when search name is not match', () => {
      const inputReportLine = { network_operator: 13 }
      const inputQuantity = { material_category: 7 }
      const inputMaterials = [
        { quantity_description: 1, network_operator: 13, material_category: 7, alias: 'AACDFMM' },
        { quantity_description: 1, network_operator: 13, material_category: 7, alias: 'ABCDFM' },
        { quantity_description: 2, network_operator: 14, material_category: 7, alias: 'ABCDG' }]
      const res = getFilterData(inputMaterials, inputReportLine, inputQuantity, 'CDF')
      expect(res.length).toEqual(2)
    })
  })

  describe('#getWorkItemsFromReportLines', () => {
    it('should get work item by 1 id', () => {
      const res = getWorkItemsFromReportLines(workItemlist, productionlLine)
      expect(res).toEqual(workItem)
    })
    it('should get work item by 2 ids', () => {
      const res = getWorkItemsFromReportLines(workItemlist, productionlLines)
      expect(res).toEqual(workItems)
    })
    it('should not get work item by incorrect id', () => {
      const res = getWorkItemsFromReportLines(workItemlist, productionlLineWrongId)
      expect(res).toEqual([])
    })
    it('should not get work item if list is null', () => {
      const res = getWorkItemsFromReportLines(null, productionlLine)
      expect(res).toEqual([])
    })
    it('should not get work item if ids is null', () => {
      const res = getWorkItemsFromReportLines(workItemlist, [])
      expect(res).toEqual([])
    })
  })

  describe('#getActiveReportLines', () => {
    it('should getActiveReportLines', () => {
      const res = getActiveReportLines(mixProductionlLines)
      expect(res).toEqual(activeProductionlLines)
    })
    it('should return [] if active reportLine does not exist', () => {
      const res = getActiveReportLines(noActiveProductionlLines)
      expect(res).toEqual([])
    })
    it('should return [] if active reportLines is null', () => {
      const res = getActiveReportLines(null)
      expect(res).toEqual([])
    })
    it('should return [] if active reportLines is []', () => {
      const res = getActiveReportLines([])
      expect(res).toEqual([])
    })
  })

  describe('#openReportDetail', () => {
    it('should go the the detail if the role is leader worker and report status is resubmitted', () => {
      const resubmittedReport = { ...reportDetailData, status: 'resubmitted' }
      openReportDetail(resubmittedReport, ROLE.LEAD_WORKER)
      expect(Actions.reportDetail).toHaveBeenCalledWith({ reportDetailData: resubmittedReport })
    })

    it('should go the the edit if the role is leader worker and report status is flagged', () => {
      const flaggedReport = { ...reportDetailData, status: 'flagged' }
      openReportDetail(flaggedReport, ROLE.LEAD_WORKER)
      expect(Actions.editReport).toHaveBeenCalledWith({ reportDetailData: flaggedReport })
    })

    it('should go the the manage detail if the role is construction manager', () => {
      openReportDetail(reportDetailData, ROLE.CONSTRUCTION_MANAGER)
      expect(Actions.managerReportDetail)
        .toHaveBeenCalledWith({ reportDetailData: reportDetailData })
    })
  })
})
