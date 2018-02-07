import { chain, isEmpty, omit, get } from 'lodash'
import { Actions } from 'react-native-router-flux'
import alert from '../utilities/prompt'
import { showError, showInfo } from '../utilities/messageBar'
import { SAVE_DRAFT_SUCCESS, SAVE_DRAFT_FAILED } from './constants'
import Storage from '../utilities/Storage'
import Strings from '../constants/strings'
import STORAGE_KEY from '../constants/storageKey'

export const getAllDraftReportPictures = () => (
  Storage.get(STORAGE_KEY.DRAFT_REPORT, false).then(reports => {
    if (reports) {
      const pictures = chain(reports)
        .values()
        .map('productReportLines')
        .flatten()
        .map('pictures')
        .flatten()
        .map('fileName')
        .without(undefined)
        .value()
      return Promise.resolve(pictures)
    }
    return Promise.resolve([])
  })
)

export const setDraft = (draft, userId, storageKey) => (
  Storage.get(storageKey, false)
    .then(drafts => {
      let draftData
      if (isEmpty(draft)) {
        draftData = omit(drafts, [userId])
      } else {
        draftData = { ...omit(drafts, [userId]), [userId]: draft }
      }
      return Storage.set(storageKey, draftData, false)
    })
    .then(() => Promise.resolve(draft))
)

export const getDraft = (userId, storageKey) => (
  Storage.get(storageKey, false).then(drafts =>
    (Promise.resolve(get(drafts, userId))))
)


export const createDraft = ({ draft, user, name, setToDraft }) => (
  setToDraft(draft, user)
    .then(() => {
      Actions.pop()
      showInfo(`${name} ${SAVE_DRAFT_SUCCESS}`, false)
    })
    .catch(() => {
      showError(`${name} ${SAVE_DRAFT_FAILED}`)
    })
)

export const showDraftAlert = ({ draft, user, name, setToDraft }) => {
  alert({
    message: 'A draft already exists. Do you want to override the draft?',
    leftText: Strings.Cancel,
    rightText: 'Override',
    rightFunc: () => createDraft({ draft, user, name, setToDraft }),
  })
}
