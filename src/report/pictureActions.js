import { createAction } from 'redux-actions'
import { pick, map } from 'lodash'
import FormData from 'react-native/Libraries/Network/FormData'
import api from '../api/api'
import { retrieveUploadPictures, cleanUnUsedPictures } from './utilities'
import { IS_ANDROID } from '../utilities/systemUtil'

export const RESET_UPLOADED_PICTURES = 'REPORT/RESET_UPLOADED_PICTURES'
export const UPLOAD_PICTURE_SUCCESS = 'REPORTS/UPLOAD_PICTURE_SUCCESS'
export const BATCH_UPLOAD_PICTURES = 'REPORTS/BATCH_UPLOAD_PICTURES'
export const BATCH_UPLOAD_PICTURES_SUCCESS = 'REPORTS/BATCH_UPLOAD_PICTURES_SUCCESS'
export const BATCH_UPLOAD_PICTURES_FAILED = 'REPORTS/BATCH_UPLOAD_PICTURES_FAILED'
export const CLEAN_UNUSED_PICTURES = 'REPORTS/CLEAN_UNUSED_PICTURES'

export const resetUploadedPictures = createAction(RESET_UPLOADED_PICTURES)
const batchRequestUploadPicture = createAction(BATCH_UPLOAD_PICTURES)
const batchUploadPictureSuccess = createAction(BATCH_UPLOAD_PICTURES_SUCCESS)
const batchUploadPictureFailed = createAction(BATCH_UPLOAD_PICTURES_FAILED)
const uploadPictureSuccess = uploadedPicture =>
  ({ type: UPLOAD_PICTURE_SUCCESS, payload: uploadedPicture })

const uploadPicture = picture => dispatch => {
  const formData = new FormData()

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  formData.append('picture', {
    ...pick(picture, ['uri', 'type']),
    name: picture.fileName,
  })

  return new Promise((resolve, reject) => {
    api.post('/api/v1/production/production_report_pictures/', formData, config)
      .then(res => {
        const uploadedPicture = {
          ...pick(picture, ['workItemId', 'uuid']),
          picture: res,
        }
        dispatch(uploadPictureSuccess(uploadedPicture))
        return resolve(uploadedPicture)
      })
      .catch(() => reject('upload picture failed'))
  })
}

export const uploadPictures = productionLines => (
  (dispatch, getState) => {
    const uploadedPictures = getState().reportForm.uploadedPictures
    const uploadedPictureUUIds = map(uploadedPictures, 'uuid')
    const pictures = retrieveUploadPictures(productionLines, uploadedPictureUUIds)

    dispatch(batchRequestUploadPicture())
    return Promise.all(map(pictures, picture => dispatch(uploadPicture(picture))))
      .then(values => {
        dispatch(batchUploadPictureSuccess())
        return Promise.resolve([...uploadedPictures, ...values])
      })
      .catch(() => {
        dispatch(batchUploadPictureFailed())
        return Promise.reject('upload pictures failed')
      })
  }
)

const cleanPictures = createAction(CLEAN_UNUSED_PICTURES, () =>
  cleanUnUsedPictures())

export const cleanUnusedPictures = () => dispatch => {
  if (IS_ANDROID) {
    return
  }
  dispatch(cleanPictures())
}
