import { Actions } from 'react-native-router-flux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {
  createExtraWorkOrder, FETCH_EXTRA_WORK_ORDER, EXTRA_WORK_ORDER_URL,
  fetchExtraWorkOrder, refreshExtraWorkOrders, SUBMIT_EXTRA_WORK_ORDER,
  RESET_ERROR_MESSAGE, resetErrorMessage, SET_EXTRA_WORK_ORDER_REFRESH,
  setExtraWorkOrderRefreshing, resetBasicInfo, RESET_BASIC_INFO, submitExtraWorkOrder,
  patchExtraWorkOrder, PATCH_EXTRA_WORK_ORDER, updateExtraWorkOrder, UPDATE_EXTRA_WORK_ORDER,
} from '../actions'
import { constructionManager, leadWorker } from '../../shared/fixture'
import { draftExtraWorkOrder } from '../fixture'
import { DEFAULT_BASIC_INFO } from '../constants'
import { formatDate } from '../../utilities/dateUtils'
import { ORDERING, ORDERING_BY_STATUS } from '../../constants/status'

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    createExtraWorkOrder: jest.fn(),
  },
}))

describe('#extra-work-order actions', () => {
  const mockStore = configureMockStore([thunk])
  let store = {}
  const initialState = {
    list: [],
    next: null,
    loading: false,
    refreshing: false,
    errorMessage: false,
    auth: {
      user: leadWorker,
    },
    draft: {
      extraWorkOrder: null,
    },
  }
  const mock = new MockAdapter(axios)

  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
    mock.reset()
  })

  describe('#fetchExtraWorkOrder', () => {
    it('it should called actions when user is leadWorker ', () => {
      const inputOffset = 0
      const user = leadWorker
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(EXTRA_WORK_ORDER_URL, params).reply(200, 'success')
      return fetchExtraWorkOrder(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is constructManager ', () => {
      const inputOffset = 0
      const user = constructionManager
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(EXTRA_WORK_ORDER_URL, params).reply(200, 'success')
      return fetchExtraWorkOrder(inputOffset, user).payload.then(res => {
        expect(res).toEqual('success')
      })
    })
    it('it should called actions when user is unknown ', () => {
      const inputOffset = 0
      const user = {}
      const params = {
        limit: 20,
        offset: inputOffset,
        ordering: ORDERING.SUBMITTED_DATE,
        created_by: user.id,
        ordering_by_status: ORDERING_BY_STATUS.LEAD_WORKER,
      }
      mock.onGet(EXTRA_WORK_ORDER_URL, params).reply(400, 'User is invalid')
      return fetchExtraWorkOrder(inputOffset, user).payload.catch(res => {
        expect(res.message).toEqual('User is invalid')
      })
    })
  })

  describe('#refreshExtraWorkOrders', () => {
    it('it should called actions when call refreshExtraWorkOrders ', () => {
      const expectActions = [SET_EXTRA_WORK_ORDER_REFRESH, FETCH_EXTRA_WORK_ORDER]
      store.dispatch(refreshExtraWorkOrders())
      expect(store.getActions().map(it => it.type)).toEqual(expectActions)
    })
  })

  describe('#setExtraWorkOrderRefreshing', () => {
    it('it should return empty result when call setExtraWorkOrderRefreshing', () => {
      const res = setExtraWorkOrderRefreshing()
      expect(res.type).toEqual(SET_EXTRA_WORK_ORDER_REFRESH)
      expect(res.payload).toBeUndefined()
    })
  })

  describe('#resetErrorMessage', () => {
    it('it should return empty result when call resetErrorMessage', () => {
      const res = resetErrorMessage()
      expect(res.type).toEqual(RESET_ERROR_MESSAGE)
      expect(res.payload).toBeUndefined()
    })
  })

  describe('#createExtraWorkOrder', () => {
    it('it should call Actions when the draft extra work order is null', () => {
      const expectActions = []
      store.dispatch(createExtraWorkOrder())
      expect(Actions.createExtraWorkOrder).toBeCalled()
      expect(store.getActions()).toEqual(expectActions)
    })

    it('it should not call Actions when the draft extra work order is exist', () => {
      const state = {
        draft: {
          extraWorkOrder: draftExtraWorkOrder,
        },
      }
      store = mockStore(state)
      const expectActions = []
      store.dispatch(createExtraWorkOrder())
      expect(Actions.createExtraWorkOrder).toBeCalled()
      expect(store.getActions()).toEqual(expectActions)
    })
  })

  describe('#resetBasicInfo', () => {
    it('it should reset name null if params is null', () => {
      const res = resetBasicInfo()
      expect(res.type).toEqual(RESET_BASIC_INFO)
      expect(res.payload).toEqual(DEFAULT_BASIC_INFO)
    })
    it('it should reset name null if params is null', () => {
      const extraWorkOrderName = `${formatDate(new Date(), 'YY-MM-DD')}-BF`
      const res = resetBasicInfo(leadWorker)
      expect(res.type).toEqual(RESET_BASIC_INFO)
      expect(res.payload).toEqual({ ...DEFAULT_BASIC_INFO, name: extraWorkOrderName })
    })
  })

  describe('#submitExtraWorkOrder', () => {
    it('it should call Actions when call createExtraWorkOrder', () => {
      const res = submitExtraWorkOrder()
      expect(res.type).toEqual(SUBMIT_EXTRA_WORK_ORDER)
    })
  })

  describe('#updateExtraWorkOrder', () => {
    it('it should call Actions when call updateExtraWorkOrder', () => {
      const params = {
        id: 10,
        status: 'resubmit',
      }
      const res = updateExtraWorkOrder(params)
      expect(res.type).toEqual(UPDATE_EXTRA_WORK_ORDER)
    })
  })

  describe('#patchExtraWorkOrder', () => {
    it('it should call actions when call patchExtraWorkOrder with status', () => {
      const inputParamWithStatus = {
        id: 10,
        status: 'approve',
        comments: 'well done',
        workorderStatus: 'issue',
      }
      mock.onPost(`${EXTRA_WORK_ORDER_URL}${10}/`, inputParamWithStatus).reply(200, 'success')
      const res = patchExtraWorkOrder(inputParamWithStatus)
      expect(res.type).toEqual(PATCH_EXTRA_WORK_ORDER)
    })
    it('it should call actions when call patchExtraWorkOrder without status', () => {
      const inputParamWithStatus = {
        id: 10,
        status: 'approve',
        comments: 'well done',
      }
      mock.onPost(`${EXTRA_WORK_ORDER_URL}${10}/`, inputParamWithStatus).reply(200, 'success')
      const res = patchExtraWorkOrder(inputParamWithStatus)
      expect(res.type).toEqual(PATCH_EXTRA_WORK_ORDER)
    })
  })
})
