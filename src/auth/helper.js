import { includes } from 'lodash'
import { Actions } from 'react-native-router-flux'
import ROLE from '../constants/role'
import { isConstructionManager, isLeadWorker } from '../utilities/role'
import { RESET_CONFIG } from '../utilities/navigator'
import Storage from '../utilities/Storage'
import STORAGE_KEY from '../constants/storageKey'

const getRole = modules => {
  if (!modules) return ROLE.UNKNOWN
  if (includes(modules, ROLE.CONSTRUCTION_MANAGER)) return ROLE.CONSTRUCTION_MANAGER
  if (includes(modules, ROLE.LEAD_WORKER)) return ROLE.LEAD_WORKER
  return ROLE.UNKNOWN
}

export const isInvalidRole = role => !isLeadWorker(role) && !isConstructionManager(role)

export const redirectToLogin = () => {
  Actions.login(RESET_CONFIG)
}

export const redirectAfterLogin = role => {
  if (isConstructionManager(role)) {
    return Actions.constructionManagerTab(RESET_CONFIG)
  }
  if (isLeadWorker(role)) {
    return Actions.leadWorkerTab(RESET_CONFIG)
  }
  // Handle App upgrade issue to resolve old data and logic
  return redirectToLogin()
}

// 1. Needs the user profile id to fetch work item list and DPR, change the user id to profile id
// 2. Needs the user.id for pushing notification
export const getUser = (user, modules) => ({
  ...user,
  id: user.profile.id,
  originUserId: user.id,
  role: getRole(modules),
})

export const saveWorkspace = workspace =>
  Storage.set(STORAGE_KEY.WORKSPACE, workspace)

export const getWorkspace = () => Storage.get(STORAGE_KEY.WORKSPACE)

export const makeupWorkSpace = workspace =>
  `http://api.${workspace}.vitruvi.cc`
