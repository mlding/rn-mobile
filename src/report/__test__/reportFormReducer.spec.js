import { omit } from 'lodash'
import reducer from '../reportFormReducer'
import { resolve, pend, reject } from '../../utilities/actions'
import {
  ADD_WORK_ITEMS,
  MODIFY_REPORTLINE_FIELD,
  MODIFY_QUANTITY_FIELD,
  ADD_QUANTITY,
  DELETE_QUANTITY,
  EDIT_QUANTITY_NAME,
  UPDATE_AS_BUILT,
  ADD_PICTURE,
  DELETE_PICTURE,
  SUBMIT_REPORT,
  UPDATE_REPORT,
  PATCH_REPORT,
  CHANGE_SHOW_ALERT_STATE,
  RESET_REPORT_INFO,
  SET_REPORT_INFO,
  ADD_ORIGIN_WORK_ITEMS,
  SET_ORIGIN_WORK_ITEMS,
  DELETE_WORK_ITEM,
  SET_PRODUCTION_LINES,
  FETCH_WORK_ITEMS_BY_REPORT_ID,
  RESET_REPORT_WORK_ITEMS,
  SET_CURRENT_REPORT_ID,
} from '../actions'
import { RESET_UPLOADED_PICTURES, UPLOAD_PICTURE_SUCCESS } from '../pictureActions'
import workItem from '../../work-item/fixture'
import report, { reportLine, workItems } from '../fixture'

describe('#report form reducer', () => {
  let initialState = {}
  const reportLineWithoutId = { ...omit(reportLine, 'id'), 'work_item': 1234, 'picture': [{ id: 1 }] }
  beforeEach(() => {
    initialState = {
      productReportLines: [...report.production_lines, reportLineWithoutId],
      showLoading: false,
      showAlert: false,
      reportInfo: { documentReference: 'Report B', note: 'test', reportedDate: '2017-12-04' },
      uploadedPictures: ['picture1.jpg', 'picture2.jpg'],
      originWorkItems: [workItem],
    }
  })

  describe('productReportLines', () => {
    it('should add an report line when action is add work items', () => {
      const reportLines = [{ ...reportLine, work_item: 123 }, { ...reportLine, work_item: 124 }]
      const action = {
        type: ADD_WORK_ITEMS,
        payload: reportLines,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...initialState.productReportLines, ...reportLines])
    })
    it('should change the report is_active to false if delete this line and payload id is exist', () => {
      const action = {
        type: DELETE_WORK_ITEM,
        payload: report.production_lines[0],
      }
      expect(reducer(initialState, action).productReportLines[0].is_active).toEqual(false)
    })
    it('should delete the report line if delete this line and payload id is not exist', () => {
      const action = {
        type: DELETE_WORK_ITEM,
        payload: reportLineWithoutId,
      }
      expect(reducer(initialState, action).productReportLines).toEqual(report.production_lines)
    })
    it('should change the report line if call the action modify quantity field', () => {
      const line = { ...reportLineWithoutId, reference_to: 'A123' }
      const action = {
        type: MODIFY_REPORTLINE_FIELD,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action modify report line field', () => {
      const line = { ...omit(reportLineWithoutId, 'quantities'), quantities: {} }
      const action = {
        type: MODIFY_QUANTITY_FIELD,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action add quantity', () => {
      const line = {
        ...omit(reportLineWithoutId, 'quantities'),
        quantities: [
          { ...reportLineWithoutId.quantities[0], quantity: 12.3 },
          ...reportLineWithoutId.quantities.slice(0),
        ],
      }
      const action = {
        type: ADD_QUANTITY,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action delete quantity', () => {
      const line = {
        ...omit(reportLineWithoutId, 'quantities'),
        quantities: reportLineWithoutId.quantities.slice(0),
      }
      const action = {
        type: DELETE_QUANTITY,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action edit quantity name', () => {
      const line = {
        ...omit(reportLineWithoutId, 'quantities'),
        quantities: [
          { ...reportLineWithoutId.quantities[0], material_name: 'test' },
          ...reportLineWithoutId.quantities.slice(0),
        ],
      }
      const action = {
        type: EDIT_QUANTITY_NAME,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action update as built', () => {
      const line = {
        ...omit(reportLineWithoutId, 'network_element'),
        network_element: {
          ...omit(reportLineWithoutId.network_element, 'as_built_annotations'),
        },
      }
      const action = {
        type: UPDATE_AS_BUILT,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })

    it('should change the report line if call the action add picture', () => {
      const line = {
        ...omit(reportLineWithoutId, 'pictures'),
        pictures: [{ id: 1 }, { id: 2 }],
      }
      const action = {
        type: ADD_PICTURE,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })
    it('should change the report line if call the action delete picture', () => {
      const line = {
        ...omit(reportLineWithoutId, 'pictures'),
        pictures: [],
      }
      const action = {
        type: DELETE_PICTURE,
        payload: line,
      }
      expect(reducer(initialState, action).productReportLines)
        .toEqual([...report.production_lines, line])
    })

    it('should set the reportLine with empty array when the action is set production liens payload is null', () => {
      const action = {
        type: SET_PRODUCTION_LINES,
      }
      expect(reducer(initialState, action).productReportLines).toEqual([])
    })

    it('should set the reportLine with payload when the action is set production liens payload is not null', () => {
      const action = {
        type: SET_PRODUCTION_LINES,
        payload: [reportLineWithoutId],
      }
      expect(reducer(initialState, action).productReportLines).toEqual([reportLineWithoutId])
    })
  })

  describe('#showLoading', () => {
    it('should set submitting false when on submit report', () => {
      const action = {
        type: pend(SUBMIT_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(true)
    })
    it('should set submitting false when resolve submit report action', () => {
      const action = {
        type: resolve(SUBMIT_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })

    it('should set loading true when reject submit report action', () => {
      const action = {
        type: reject(SUBMIT_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })

    it('should set submitting false when on update report', () => {
      const action = {
        type: pend(UPDATE_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(true)
    })
    it('should set submitting false when resolve update report action', () => {
      const action = {
        type: resolve(UPDATE_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })
    it('should set loading true when reject update report action', () => {
      const action = {
        type: reject(UPDATE_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })

    it('should set submitting false when on update report status', () => {
      const action = {
        type: pend(PATCH_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(true)
    })
    it('should set submitting false when resolve update report status action', () => {
      const action = {
        type: resolve(PATCH_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })
    it('should set loading true when reject update report status action', () => {
      const action = {
        type: reject(PATCH_REPORT),
      }
      expect(reducer(initialState, action).showLoading).toEqual(false)
    })
  })

  describe('#showAlert', () => {
    it('should set showAlert true when payload is true', () => {
      const action = {
        type: CHANGE_SHOW_ALERT_STATE,
        payload: true,
      }
      expect(reducer(initialState, action).showAlert).toEqual(true)
    })
  })

  describe('#reportInfo', () => {
    it('should reset the report info with payload when the action type is reset report info', () => {
      const info = { documentReference: 'Report A', note: '', reportedDate: '2017-12-04' }
      const action = {
        type: RESET_REPORT_INFO,
        payload: info,
      }
      expect(reducer(initialState, action).reportInfo).toEqual(info)
    })
    it('should set the report info when the action type is set report info', () => {
      const info = { documentReference: 'Report A', reportedDate: '2017-12-04' }
      const action = {
        type: SET_REPORT_INFO,
        payload: info,
      }
      expect(reducer(initialState, action).reportInfo)
        .toEqual({ ...info, note: initialState.reportInfo.note })
    })
  })

  describe('#uploadedPictures', () => {
    it('should add the uploadedPictures when update picture success', () => {
      const action = {
        type: UPLOAD_PICTURE_SUCCESS,
        payload: 'picture3.jpg',
      }
      expect(reducer(initialState, action).uploadedPictures)
        .toEqual([...initialState.uploadedPictures, 'picture3.jpg'])
    })
    it('should reset the uploadedPictures to empty array when reset uploaded picture', () => {
      const action = {
        type: RESET_UPLOADED_PICTURES,
      }
      expect(reducer(initialState, action).uploadedPictures).toEqual([])
    })
  })

  describe('#originWorkItems', () => {
    it('should add items when actions is add origin work items', () => {
      const newWorkItems = [
        { ...workItem, id: 12 },
        { ...workItem, id: 113 },
      ]
      const action = {
        type: ADD_ORIGIN_WORK_ITEMS,
        payload: newWorkItems,
      }
      expect(reducer(initialState, action).originWorkItems)
        .toEqual([workItem, ...newWorkItems])
    })
    it('should set the originWorkItems with empty array when the action is set origin work items and payload is null', () => {
      const action = {
        type: SET_ORIGIN_WORK_ITEMS,
      }
      expect(reducer(initialState, action).originWorkItems).toEqual([])
    })
    it('should set the originWorkItems with work item when the action is set origin work items and payload is not null', () => {
      const newWorkItems = [
        { ...workItem, id: 12 },
        { ...workItem, id: 113 },
      ]
      const action = {
        type: SET_ORIGIN_WORK_ITEMS,
        payload: newWorkItems,
      }
      expect(reducer(initialState, action).originWorkItems).toEqual(newWorkItems)
    })
    it('should delete items when actions is delete work item', () => {
      const action = {
        type: DELETE_WORK_ITEM,
        payload: { ...omit(workItem, ['id']), work_item: workItem.id },
      }
      expect(reducer(initialState, action).originWorkItems).toEqual([])
    })
  })

  describe('#reportWorkItems', () => {
    it('should FETCH_WORK_ITEMS_BY_REPORT_ID', () => {
      const action = {
        type: resolve(FETCH_WORK_ITEMS_BY_REPORT_ID),
        payload: {
          count: 1,
          next: null,
          previous: null,
          results: workItems,
        },
      }
      expect(reducer(initialState, action).reportWorkItems).toEqual(workItems)
    })
    it('should RESET_REPORT_WORK_ITEMS', () => {
      const action = {
        type: RESET_REPORT_WORK_ITEMS,
      }
      expect(reducer(initialState, action).reportWorkItems).toEqual([])
    })
  })

  describe('#currentReportId', () => {
    it('should SET_CURRENT_REPORT_ID', () => {
      const action = {
        type: SET_CURRENT_REPORT_ID,
        payload: 13,
      }
      expect(reducer(initialState, action).currentReportId).toEqual(13)
    })
  })
})
