import moment from 'moment'
import { noop } from 'lodash'
import { Actions } from 'react-native-router-flux'
import { deleteDraftPrompt, swipeBtns, updateWorkItemInDraft } from '../swipeOutUtils'
import { leadWorker, workItem, draftReport } from '../../shared/fixture'
import { getDefaultName } from '../../utilities/utils'
import { monthNames } from '../../utilities/dateUtils'
import alert from '../../utilities/prompt'
import { showError } from '../../utilities/messageBar'

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    pop: jest.fn(),
  },
}))

jest.mock('../../utilities/prompt', () => jest.fn())

jest.mock('../../utilities/messageBar', () => ({
  showError: jest.fn(),
  showInfo: jest.fn(),
}))

describe('swipeOutUtils', () => {
  describe('#deleteDraftPrompt', () => {
    it('should call alert function', () => {
      const params = { setDraft: noop, user: leadWorker, name: '', type: '' }
      deleteDraftPrompt(params)
      expect(alert).toHaveBeenCalled()
    })
    it('should call Action pop when needGoBack', () => {
      alert.mockImplementation(input => {
        const { rightFunc } = input
        rightFunc()
      })
      const params = { setDraft: () => Promise.resolve(), user: leadWorker, name: '', type: '' }
      deleteDraftPrompt(params, true)
      expect(Actions.pop).toHaveBeenCalled()
    })
    it('should call Action pop when set draft failed', () => {
      alert.mockImplementation(input => {
        const { rightFunc } = input
        rightFunc()
      })
      const setDraftFunc = () => Promise.reject()

      const params = { setDraft: setDraftFunc, user: leadWorker, name: '', type: '' }
      deleteDraftPrompt(params, false)

      return new Promise(resolve => setTimeout(() => { resolve() }, 0))
        .then(() => {
          expect(showError).toHaveBeenCalled()
        })
    })
  })

  describe('#swipeBtns', () => {
    it('it should call pressCallback when call onpress', () => {
      const pressCallback = jest.fn()
      swipeBtns('', '', pressCallback, {})[0].onPress()
      expect(pressCallback).toHaveBeenCalled()
    })
  })

  describe('#updateWorkItemInDraft', () => {
    let mockSetDraftReportFn

    beforeEach(() => {
      mockSetDraftReportFn = jest.fn(() => Promise.resolve('success'))
    })

    it('should add workItem to draft when there not exsit draft', () => {
      const params = {
        item: { ...workItem, 'network_element': {}, 'quantities': [] },
        draft: null,
        setDraftReport: mockSetDraftReportFn,
        user: leadWorker }
      const updatedDraft = {
        documentReference: getDefaultName(leadWorker),
        reportedDate: [moment().year(), monthNames[moment().month()], moment().date()],
        notes: null,
        productReportLines: [{ 'activity_code': '412A',
          'comments': '',
          'is_active': true,
          'network_element': {},
          'pictures': [],
          'quantities': [],
          'reference_from': undefined,
          'reference_to': undefined,
          'work_item': 4313,
          'work_item_completed': false,
          'work_item_descriptor': 'Setup splice case' }],
        status: 'Draft',
        approver_name: '--' }

      updateWorkItemInDraft(params)
      expect(mockSetDraftReportFn).toBeCalledWith(updatedDraft, leadWorker)
    })
    it('should add workItem to exsiting draft when there exsit draft', () => {
      const params = {
        item: { ...workItem, 'network_element': {}, 'quantities': [] },
        draft: { ...draftReport, 'approver_name': 'draft', 'documentReference': 'draft', 'reportedDate': [2017, 'October', 11] },
        setDraftReport: mockSetDraftReportFn,
        user: leadWorker }
      const updatedDraft = {
        documentReference: 'draft',
        reportedDate: [2017, 'October', 11],
        notes: 'aaaa',
        productReportLines: [{ 'activity_code': '412a', 'comments': '', 'name': 'string', 'quantities': [{ 'estimated_quantity': 100, 'is_primary_quantity': true, 'material': 1358, 'material_category': 1024, 'material_name': 'STUB-432F', 'material_type': 'STUB-432F', 'quantity': 100, 'quantity_description': 493, 'quantity_description_name': 'cable distance', 'quantity_description_unit_imperial': 'ft', 'quantity_description_unit_metric': 'm', 'quantity_description_unit_system': 'metric', 'remaining_quantity': 100, 'work_item_quantity': 1353 }], 'reference_from': 'SV623', 'reference_to': 'SB31', 'work_item': 4667, 'work_item_completed': false }, { 'activity_code': '412A', 'comments': '', 'is_active': true, 'network_element': {}, 'pictures': [], 'quantities': [], 'reference_from': undefined, 'reference_to': undefined, 'work_item': 4313, 'work_item_completed': false, 'work_item_descriptor': 'Setup splice case' }],
        status: 'Draft',
        approver_name: 'draft' }

      updateWorkItemInDraft(params)
      expect(mockSetDraftReportFn).toBeCalledWith(updatedDraft, leadWorker)
    })
    it('should add workItem to exsiting draft when isAddedToDraft is true', () => {
      const params = {
        item: { ...workItem, 'network_element': {}, 'quantities': [] },
        draft: { ...draftReport, 'approver_name': 'draft', 'documentReference': 'draft', 'reportedDate': [2017, 'October', 11] },
        setDraftReport: mockSetDraftReportFn,
        user: leadWorker }
      const updatedDraft = {
        documentReference: 'draft',
        reportedDate: [2017, 'October', 11],
        notes: 'aaaa',
        productReportLines: [{ 'activity_code': '412a', 'comments': '', 'name': 'string', 'quantities': [{ 'estimated_quantity': 100, 'is_primary_quantity': true, 'material': 1358, 'material_category': 1024, 'material_name': 'STUB-432F', 'material_type': 'STUB-432F', 'quantity': 100, 'quantity_description': 493, 'quantity_description_name': 'cable distance', 'quantity_description_unit_imperial': 'ft', 'quantity_description_unit_metric': 'm', 'quantity_description_unit_system': 'metric', 'remaining_quantity': 100, 'work_item_quantity': 1353 }], 'reference_from': 'SV623', 'reference_to': 'SB31', 'work_item': 4667, 'work_item_completed': false }],
        status: 'Draft',
        approver_name: 'draft' }

      updateWorkItemInDraft(params, true)
      expect(mockSetDraftReportFn).toBeCalledWith(updatedDraft, leadWorker)
    })

    it('should call show error when set draft failed', () => {
      mockSetDraftReportFn = jest.fn(() => Promise.reject())
      const params = {
        item: { ...workItem, 'network_element': {}, 'quantities': [] },
        draft: { ...draftReport, 'approver_name': 'draft', 'documentReference': 'draft', 'reportedDate': [2017, 'October', 11] },
        setDraftReport: mockSetDraftReportFn,
        user: leadWorker }

      updateWorkItemInDraft(params, true)
      return new Promise(resolve => setTimeout(() => resolve(), 0))
        .then(() => {
          expect(showError).toHaveBeenCalled()
        })
    })
  })
})
