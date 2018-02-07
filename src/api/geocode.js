import api from './api'
import { GEOCODE_KEY } from '../constants/map'

export const getGeoAddress = coordinate => ( // eslint-disable-line import/prefer-default-export
  api.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${coordinate.latitude},${coordinate.longitude}&key=${GEOCODE_KEY}`)
)
