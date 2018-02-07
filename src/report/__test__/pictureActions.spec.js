import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { pick } from 'lodash'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import FormData from 'react-native/Libraries/Network/FormData'
import SystemUtil from '../../utilities/systemUtil'

import {
  uploadPictures,
  cleanUnusedPictures,
  UPLOAD_PICTURE_SUCCESS,
  BATCH_UPLOAD_PICTURES,
  BATCH_UPLOAD_PICTURES_SUCCESS,
  BATCH_UPLOAD_PICTURES_FAILED,
  CLEAN_UNUSED_PICTURES,
} from '../pictureActions'

jest.mock('../../utilities/systemUtil', () => ({
  IS_ANDROID: true,
}))

jest.mock('../utilities', () => ({
  retrieveUploadPictures: () => (
    [
      { uuid: 1, workItemId: 1, uri: 'file://1', fileName: '1.jepg' },
      { uuid: 2, workItemId: 2, uri: 'file://2', fileName: '2.jepg' },
    ]
  ),
  cleanUnUsedPictures: jest.fn(),
}))

describe('Report Picture Actions', () => {
  const initialState = {
    reportForm: {
      uploadedPictures: [],
    },

    draft: {
      report: null,
    },
  }

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let store = {}

  const uploadPicture1 = { uuid: 1, workItemId: 1, uri: 'file://1', fileName: '1.jepg' }
  const uploadPicture2 = { uuid: 2, workItemId: 2, uri: 'file://2', fileName: '2.jepg' }

  const responseData1 = { id: 1 }
  const responseData2 = { id: 2 }

  const pictureFormData1 = new FormData()
  pictureFormData1.append('picture', {
    uri: uploadPicture1.uri,
    name: uploadPicture1.fileName,
  })
  const pictureFormData2 = new FormData()
  pictureFormData2.append('picture', {
    uri: uploadPicture2.uri,
    name: uploadPicture2.fileName,
  })

  const exceptData1 = {
    ...pick(uploadPicture1, ['workItemId', 'uuid']),
    picture: responseData1,
  }
  const exceptData2 = {
    ...pick(uploadPicture2, ['workItemId', 'uuid']),
    picture: responseData2,
  }

  const mock = new MockAdapter(axios)


  beforeEach(() => {
    store = mockStore(initialState)
  })

  afterEach(() => {
    store.clearActions()
    mock.reset()
  })

  describe('#uploadPictures', () => {
    const URL = '/api/v1/production/production_report_pictures/'
    it('should call batch upload success when all the picture upload success', () => {
      mock
        .onPost(URL, pictureFormData1).reply(201, responseData1)
        .onPost(URL, pictureFormData2).reply(201, responseData2)

      const expectedActions = [
        { type: BATCH_UPLOAD_PICTURES },
        { type: UPLOAD_PICTURE_SUCCESS, payload: exceptData1 },
        { type: UPLOAD_PICTURE_SUCCESS, payload: exceptData2 },
        { type: BATCH_UPLOAD_PICTURES_SUCCESS },
      ]
      return store.dispatch(uploadPictures()).then(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('should call one upload success and batch upload failed when part picture upload success', () => {
      mock
        .onPost(URL, pictureFormData1).reply(201, responseData1)
        .onPost(URL, pictureFormData2).reply(413, { message: 'the image is too big' })

      const expectedActions = [
        { type: BATCH_UPLOAD_PICTURES },
        { type: UPLOAD_PICTURE_SUCCESS, payload: exceptData1 },
        { type: BATCH_UPLOAD_PICTURES_FAILED },
      ]
      return store.dispatch(uploadPictures()).catch(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    it('should not call upload pictures success when all picture upload failed', () => {
      mock.onPost(URL, pictureFormData2).reply(413, { message: 'the image is too big' })

      const expectedActions = [
        { type: BATCH_UPLOAD_PICTURES },
        { type: BATCH_UPLOAD_PICTURES_FAILED },
      ]
      return store.dispatch(uploadPictures()).catch(() => {
        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('#cleanUnusedPictures', () => {
    it('should not call clean picture when is android', () => {
      SystemUtil.IS_ANDROID = true //eslint-disable-line
      store.dispatch(cleanUnusedPictures())
      expect(store.getActions()).toEqual([])
    })

    it('should call clean picture when is ios', () => {
      SystemUtil.IS_ANDROID = false //eslint-disable-line
      store.dispatch(cleanUnusedPictures())
      expect(store.getActions()).toEqual([{ type: CLEAN_UNUSED_PICTURES }])
    })
  })
})
