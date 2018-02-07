import { Actions } from 'react-native-router-flux'
import {
  getAllDraftReportPictures,
  setDraft,
  getDraft,
  createDraft,
} from '../utilities'
import Storage from '../../utilities/Storage'
import STORAGE_KEY from '../../constants/storageKey'
import { DRAFT_TYPE } from '../constants'
import { draftReport, leadWorker } from '../../shared/fixture'
import { showError, showInfo } from '../../utilities/messageBar'

jest.mock('../../utilities/messageBar', () => ({
  showError: jest.fn(),
  showInfo: jest.fn(),
}))

describe('report utilities', () => {
  describe('#getAllDraftReportPictures', () => {
    it('should return empty array when has no local draft', () => {
      Storage.get.mockReturnValueOnce(Promise.resolve(null))
      return getAllDraftReportPictures().then(pictures => {
        expect(pictures).toEqual([])
      })
    })

    it('should return empty array when draft has no productReportLines', () => {
      const drafts = {
        1: {
          id: 1,
        },
        2: {
          id: 2,
        },
      }
      Storage.get.mockReturnValueOnce(Promise.resolve(drafts))
      return getAllDraftReportPictures().then(pictures => {
        expect(pictures).toEqual([])
      })
    })

    it('should return all draft picture when one draft has no pictures', () => {
      const drafts = {
        1: {
          id: 1,
          productReportLines: {
            pictures: [{ fileName: '1.jpg' }, { fileName: '2.jpg' }],
          },
        },
        2: {
          id: 2,
          productReportLines: {},
        },
      }
      Storage.get.mockReturnValueOnce(Promise.resolve(drafts))
      return getAllDraftReportPictures().then(pictures => {
        expect(pictures).toEqual(['1.jpg', '2.jpg'])
      })
    })

    it('should return all draft pictures when has no local draft', () => {
      const drafts = {
        1: {
          id: 1,
          productReportLines: {
            pictures: [{ fileName: '1.jpg' }, { fileName: '2.jpg' }],
          },
        },
        2: {
          id: 2,
          productReportLines: {
            pictures: [{ fileName: '3.jpg' }, { fileName: '4.jpg' }],
          },
        },
      }
      Storage.get.mockReturnValueOnce(Promise.resolve(drafts))
      return getAllDraftReportPictures().then(pictures => {
        expect(pictures).toEqual(['1.jpg', '2.jpg', '3.jpg', '4.jpg'])
      })
    })
  })

  describe('#setDraft', () => {
    it('should add a draftReport when the draftReport exist and the user not have draftReport before', () => {
      const storagedReport = { 1: draftReport }
      Storage.get.mockReturnValueOnce(Promise.resolve(storagedReport))

      return setDraft(draftReport, leadWorker.id, STORAGE_KEY.DRAFT_REPORT).then(() => {
        expect(Storage.set).toBeCalledWith(STORAGE_KEY.DRAFT_REPORT,
          { ...storagedReport, [leadWorker.id]: draftReport }, false)
      })
    })

    it('should update the draftReport when the draftReport exist and the user have draftReport before', () => {
      const storagedReport = { [leadWorker.id]: draftReport }
      const updatedDraft = { ...draftReport, name: 'update' }
      Storage.get.mockReturnValueOnce(Promise.resolve(storagedReport))

      return setDraft(updatedDraft, leadWorker.id, STORAGE_KEY.DRAFT_REPORT).then(() => {
        expect(Storage.set).toBeCalledWith(STORAGE_KEY.DRAFT_REPORT,
          { [leadWorker.id]: updatedDraft }, false)
      })
    })

    it('should delete the draftReport when draft is null and the user have draftReport before', () => {
      const storagedReport = { [leadWorker.id]: draftReport }
      Storage.get.mockReturnValueOnce(Promise.resolve(storagedReport))

      return setDraft(null, leadWorker.id, STORAGE_KEY.DRAFT_REPORT).then(() => {
        expect(Storage.set).toBeCalledWith(STORAGE_KEY.DRAFT_REPORT, {}, false)
      })
    })
  })

  describe('#getDraft', () => {
    it('should get the draft report when user had draft in storage', () => {
      const storagedReport = { [leadWorker.id]: draftReport }
      Storage.get.mockReturnValueOnce(Promise.resolve(storagedReport))
      return getDraft(leadWorker.id, DRAFT_TYPE.report).then(report => {
        expect(report).toEqual(draftReport)
      })
    })

    it('should get undefined when user not draft in storage', () => {
      const storagedReport = { 1: draftReport }
      Storage.get.mockReturnValueOnce(Promise.resolve(storagedReport))
      return getDraft(leadWorker.id, STORAGE_KEY.DRAFT_REPORT).then(report => {
        expect(report).toEqual(undefined)
      })
    })
  })

  describe('#createDraft', () => {
    it('should call showInfo and goback when setToDraft success', () => {
      const params = {
        draft: draftReport,
        user: leadWorker,
        name: 'report1',
        setToDraft: () => Promise.resolve(draftReport),
      }
      return createDraft(params).then(() => {
        expect(showInfo).toHaveBeenCalledWith('report1 is saved as draft.', false)
        expect(Actions.pop).toHaveBeenCalled()
      })
    })

    it('should call showError when setToDraft success', () => {
      const params = {
        draft: draftReport,
        user: leadWorker,
        name: 'report1',
        setToDraft: () => Promise.reject(draftReport),
      }
      return createDraft(params).then(() => {
        expect(showError).toHaveBeenCalledWith('report1 failed to save as draft.')
      })
    })
  })
})
