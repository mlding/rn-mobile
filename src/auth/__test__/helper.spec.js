import { Actions } from 'react-native-router-flux'
import { isInvalidRole, getUser, redirectAfterLogin, makeupWorkSpace } from '../helper'
import ROLE from '../../constants/role'

jest.mock('react-native-router-flux', () => ({
  ActionConst: { RESET: 'reset' },
  Actions: {
    constructionManagerTab: jest.fn(),
    leadWorkerTab: jest.fn(),
    login: jest.fn(),
  },
}))

describe('Auth Helper', () => {
  describe('#isInvalidRole', () => {
    it('should return false when role is leader_worker', () => {
      const role = ROLE.LEAD_WORKER
      expect(isInvalidRole(role)).toBeFalsy()
    })
    it('should return false when role is construction_manager', () => {
      const role = ROLE.CONSTRUCTION_MANAGER
      expect(isInvalidRole(role)).toBeFalsy()
    })
    it('should return true when role is wrong_role', () => {
      expect(isInvalidRole('wrong_role')).toBeTruthy()
    })
  })
  describe('#getUser', () => {
    it('should get user when roles is array containing construction_manager and lead_worker', () => {
      const user = {
        first_name: 'Bernie',
        last_name: 'Will',
        profile: {
          id: 2,
        },
      }
      const modules = ['construction_manager', 'lead_worker']
      const expectedUser = {
        id: 2,
        first_name: 'Bernie',
        last_name: 'Will',
        role: ROLE.CONSTRUCTION_MANAGER,
        profile: {
          id: 2,
        },
      }
      expect(getUser(user, modules)).toEqual(expectedUser)
    })
    it('should get user when roles is array only containing lead_worker', () => {
      const user = {
        first_name: 'Bernie',
        last_name: 'Will',
        profile: {
          id: 2,
        },
      }
      const modules = ['lead_worker']
      const expectedUser = {
        id: 2,
        first_name: 'Bernie',
        last_name: 'Will',
        role: ROLE.LEAD_WORKER,
        profile: {
          id: 2,
        },
      }
      expect(getUser(user, modules)).toEqual(expectedUser)
    })
    it('should get user with invalid role when roles is null', () => {
      const user = {
        id: 1,
        first_name: 'Bernie',
        last_name: 'Will',
        profile: {
          id: 2,
        },
      }
      const expectedUser = {
        id: 2,
        first_name: 'Bernie',
        last_name: 'Will',
        role: ROLE.UNKNOWN,
        profile: {
          id: 2,
        },
        originUserId: 1,
      }
      expect(getUser(user, null)).toEqual(expectedUser)
    })
    it('should get user with invalid role when roles not containing lead_worker and construction_manager', () => {
      const user = {
        id: 1,
        first_name: 'Bernie',
        last_name: 'Will',
        profile: {
          id: 2,
        },
      }
      const modules = ['wrong_role']
      const expectedUser = {
        id: 2,
        first_name: 'Bernie',
        last_name: 'Will',
        role: ROLE.UNKNOWN,
        profile: {
          id: 2,
        },
        originUserId: 1,
      }
      expect(getUser(user, modules)).toEqual(expectedUser)
    })
  })

  describe('#redirectAfterLogin', () => {
    it('should redirect to construction manager tab when role is construction_manager', () => {
      redirectAfterLogin('construction_manager')
      expect(Actions.constructionManagerTab).toBeCalled()
    })
    it('should redirect to lead worker tab when role is lead_worker', () => {
      redirectAfterLogin('lead_worker')
      expect(Actions.leadWorkerTab).toBeCalled()
    })
    it('should redirect to login when role is invalid', () => {
      redirectAfterLogin('invalid_role')
      expect(Actions.login).toBeCalled()
    })
  })

  describe('makeupWorkSpace', () => {
    it('should return api when given workspace', () => {
      expect(makeupWorkSpace('dev')).toEqual('http://api.dev.vitruvi.cc')
    })
  })
})

