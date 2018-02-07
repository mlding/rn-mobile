import Role from '../constants/role'

export const isConstructionManager = role => Role.CONSTRUCTION_MANAGER === role

export const isLeadWorker = role => Role.LEAD_WORKER === role
