import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import moment from 'moment'
import { omit, map } from 'lodash'
import { Actions } from 'react-native-router-flux'
import {
  modifyReportLineField,
  modifyQuantityField,
  MODIFY_REPORTLINE_FIELD,
  MODIFY_QUANTITY_FIELD,
  updateAsBuilt,
  UPDATE_AS_BUILT,
  addQuantity,
  deleteQuantity,
  editQuantityName,
  toggleSortPanel,
  createReport,
  resetReportInfo,
  RESET_REPORT_INFO,
  setReportInfo,
  SET_REPORT_INFO,
  sortReportList,
  CHANGE_SORT_TYPE,
  FETCH_REPORTS,
  deletePicture,
  DELETE_PICTURE,
  ADD_PICTURE,
  addPicture,
  SET_REPORTS_REFRESH,
  refreshReports,
  addWorkItems,
  ADD_WORK_ITEMS,
  patchReport,
  PATCH_REPORT,
  submitReport,
  SUBMIT_REPORT,
  updateReport,
  UPDATE_REPORT, fetchWorkItemsByReportId, FETCH_WORK_ITEMS_BY_REPORT_ID,
} from '../actions'
import { monthNames } from '../../utilities/dateUtils'
import { reportLine, asBuiltAnnotation, materials, picture, workItems } from '../fixture'
import { convertMaterialToReportLineQuantity, convertWorkItemToReportLine } from '../../utilities/reportDataProcess'
import { getDefaultName, uuid } from '../../utilities/utils'
import { DEFAULT_SORT_TYPE } from '../constants'
import { draftReport, leadWorker } from '../../shared/fixture'
import alert from '../../utilities/prompt'
import { addArrayItem, removeArrayItem } from '../../utilities/array'

jest.mock('../../utilities/prompt', () => jest.fn())

jest.mock('../../utilities/utils', () => ({
  getDefaultName: jest.fn(),
  uuid: jest.fn(),
}))

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    pop: jest.fn(),
    sortPanel: jest.fn(),
    createReport: jest.fn(),
    mapView: jest.fn(),
    currentScene: '',
  },
}))

describe('Report Actions', () => {
  const mockStore = configureMockStore([thunk])
  let store = {}
  const initialState = {
    auth: { user: leadWorker },
    reports: { sortType: DEFAULT_SORT_TYPE },
    draft: { report: draftReport },
    reportForm: { originWorkItems: [] },
  }

  beforeEach(() => {
    store = mockStore(initialState)
    Actions.currentScene = 'sortPanel'
  })

  afterEach(() => {
    store.clearActions()
  })

  describe('Production Report Line', () => {
    it('should change the the work item completed value when call modifyReportLineField action with complete state', () => {
      const isComplete = false
      const report = modifyReportLineField(reportLine, { work_item_completed: isComplete })
      expect(report.type).toEqual(MODIFY_REPORTLINE_FIELD)
      expect(report.payload.work_item_completed).toEqual(isComplete)
    })
    it('should update the comment value when call modifyReportLineField action with comment', () => {
      const comment = 'good job'
      const report = modifyReportLineField(reportLine, { comments: comment })
      expect(report.type).toEqual(MODIFY_REPORTLINE_FIELD)
      expect(report.payload.comments).toEqual(comment)
    })
    it('should update the quantity value when call modifyQuantityField action with quantity', () => {
      const quantity = reportLine.quantities[0]
      const actualQuantity = 50
      const report = modifyQuantityField(reportLine, quantity, { quantity: actualQuantity })
      expect(report.type).toEqual(MODIFY_QUANTITY_FIELD)

      expect(report.payload.quantities[0].quantity).toEqual(actualQuantity)
    })
    it('should update the quantity value when call modifyQuantityField action with remaining', () => {
      const quantity = reportLine.quantities[0]
      const remaining = 56
      const report = modifyQuantityField(reportLine, quantity, { remaining_quantity: remaining })
      expect(report.type).toEqual(MODIFY_QUANTITY_FIELD)
      expect(report.payload.quantities[0].remaining_quantity).toEqual(remaining)
    })
    it('should add quantity to reportline when call addQuantity', () => {
      const inputReportLine = reportLine
      const inputMaterial = materials[0]
      const outputReportLine = addQuantity(inputReportLine, inputMaterial).payload
      expect(outputReportLine.quantities.length).toEqual(4)
      expect(outputReportLine.quantities[3])
        .toEqual({ ...convertMaterialToReportLineQuantity(inputMaterial), estimated_quantity: 0 })
    })
    it('should delete quantity to reportline when call deleteQuantity', () => {
      const inputReportLine = reportLine
      const inputQuantity = reportLine.quantities[1]
      const outputReportLine = deleteQuantity(inputReportLine, inputQuantity).payload
      expect(inputReportLine.quantities.includes(inputQuantity)).toEqual(true)
      expect(outputReportLine.quantities.includes(inputQuantity)).toEqual(false)
    })
    it('should modify quantity name when call edit quantity name', () => {
      const inputReportLine = reportLine
      const inputQuantity = reportLine.quantities[1]
      const inputMaterial = materials[0]
      const outputReportLine =
        editQuantityName(inputReportLine, inputQuantity, inputMaterial).payload
      expect(outputReportLine.quantities[1].material_name).toEqual(inputMaterial.alias)
    })
  })

  describe('#updateAsBuilt', () => {
    it('should updateAsBuilt', () => {
      const report = updateAsBuilt(reportLine, asBuiltAnnotation)
      expect(report.type).toEqual(UPDATE_AS_BUILT)
      expect(report.payload.network_element.as_built_annotations[0]).toEqual(asBuiltAnnotation)
    })
    it('should updateAsBuilt if as_built_annotations is null', () => {
      const reportLineWithoutAsBuiltAnnotations = omit(reportLine, 'network_element.as_built_annotations')
      const expectActions = [{
        type: UPDATE_AS_BUILT,
        payload: reportLineWithoutAsBuiltAnnotations,
      }]
      store.dispatch(updateAsBuilt(reportLineWithoutAsBuiltAnnotations, asBuiltAnnotation))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#toggleSortPanel', () => {
    it('should call pop function when current scene is sort panel', () => {
      toggleSortPanel()
      expect(Actions.pop).toHaveBeenCalled()
    })
    it('should call sortPanel  when current scene is not sort panel', () => {
      Actions.currentScene = 'Test'
      toggleSortPanel()
      expect(Actions.sortPanel).toHaveBeenCalled()
    })
  })

  describe('#createReport', () => {
    it('should not call pop function when current scene is not sort panel', () => {
      Actions.pop.mockClear()
      Actions.currentScene = 'something'
      store.dispatch(createReport())
      expect(Actions.pop).not.toHaveBeenCalled()
    })
    it('should call pop function when current scene is sort panel', () => {
      store.dispatch(createReport())
      expect(Actions.pop).toHaveBeenCalled()
    })
    it('should call alert function when has draft', () => {
      alert.mockImplementation(input => {
        const { leftFunc, rightFunc } = input
        leftFunc()
        rightFunc()
      })
      store.dispatch(createReport())
      expect(alert).toHaveBeenCalled()
    })
    it('should call go to create Report page when has no draft', () => {
      store = mockStore({
        draft: {
          report: null,
        },
      })
      store.dispatch(createReport())
      expect(Actions.createReport).toHaveBeenCalled()
    })
  })

  describe('#resetReportInfo', () => {
    it('should reset the report info', () => {
      getDefaultName.mockReturnValue('name')
      const expectActions = [{
        type: RESET_REPORT_INFO,
        payload: {
          documentReference: 'name',
          notes: '',
          reportedDate: [moment().year(), monthNames[moment().month()], moment().date()],
        },
      }]
      store = mockStore(initialState)
      store.dispatch(resetReportInfo())
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#setReportInfo', () => {
    it('should reset the report info', () => {
      const payload = {
        documentReference: 'name',
        notes: '',
        reportedDate: '123',
      }
      const expectActions = [{
        type: SET_REPORT_INFO,
        payload: payload,
      }]
      store = mockStore()
      store.dispatch(setReportInfo(payload))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#sortReportList', () => {
    it('should sort the report list', () => {
      const sortType = 'sortType'
      const expectActions = [CHANGE_SORT_TYPE, FETCH_REPORTS]
      store.dispatch(sortReportList(sortType))
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })

  describe('#deletePicture', () => {
    it('should deletePicture', () => {
      const expectActions = [{
        type: DELETE_PICTURE,
        payload: {
          ...reportLine,
          pictures: removeArrayItem(reportLine.pictures, 1),
        },
      }]
      store.dispatch(deletePicture(reportLine, 1))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#addPicture', () => {
    it('should addPicture', () => {
      const expectActions = [{
        type: ADD_PICTURE,
        payload: {
          ...reportLine,
          pictures: addArrayItem(reportLine.pictures,
            { ...picture,
              workItemId: reportLine.work_item,
              uuid: uuid(),
            }, false),
        },
      }]
      store.dispatch(addPicture(reportLine, picture))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#refreshReports', () => {
    it('should refreshReports', () => {
      const expectActions = [SET_REPORTS_REFRESH, FETCH_REPORTS]
      store.dispatch(refreshReports())
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })

  describe('#addWorkItems', () => {
    it('should addWorkItems', () => {
      const expectActions = [
        {
          type: ADD_WORK_ITEMS,
          payload: map(workItems, workItem => convertWorkItemToReportLine(workItem)),
        }]
      store.dispatch(addWorkItems(workItems))
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#patchReport', () => {
    it('should patchReport', () => {
      const expectActions = [PATCH_REPORT]
      store.dispatch(patchReport({ id: 111, status: 'resubmitted', comments: 'my comment' }))
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })

  describe('#submitReport', () => {
    it('should submitReport', () => {
      const expectActions = [SUBMIT_REPORT]
      store.dispatch(submitReport())
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })

  describe('#updateReport', () => {
    it('should updateReport', () => {
      const expectActions = [UPDATE_REPORT]
      store.dispatch(updateReport({ id: 222 }))
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })

  describe('#updateReport', () => {
    it('should updateReport', () => {
      const expectActions = [FETCH_WORK_ITEMS_BY_REPORT_ID]
      store.dispatch(fetchWorkItemsByReportId({ reportId: 222 }))
      expect(store.getActions().map(item => item.type)).toEqual(expectActions)
    })
  })
})
