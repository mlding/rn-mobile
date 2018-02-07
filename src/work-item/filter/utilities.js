import { map, filter, find, get } from 'lodash'
import { Actions } from 'react-native-router-flux'
import { FILTER_TYPE, DRAFT_FILTERS } from './constants'
import SCENE_KEY from '../../constants/sceneKey'

export const getDraftFilter = text => ({
  key: `${FILTER_TYPE.DRAFT}_${text}`,
  id: text,
  filterType: FILTER_TYPE.DRAFT,
  name: text,
})

export const getDraftFilters = () =>
  map(DRAFT_FILTERS, filterItem => (getDraftFilter(filterItem.text)))

export const getFilterItemsByType = (filterType, filters) => (
  filter(filters, item => item.filterType === filterType)
)

export const getFilterBarLabel = text => (
  get(find(DRAFT_FILTERS, item => item.text === text), 'label')
)

export const hideFilterPanel = () => {
  if (Actions.currentScene === SCENE_KEY.FILTER_PANEL) {
    Actions.pop()
  }
}

export const showToast = message => {
  if (Actions.currentScene !== SCENE_KEY.WORK_ITEMS_TAB) return
  Actions.toast({ message })
}
