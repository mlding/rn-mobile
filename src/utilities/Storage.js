import { AsyncStorage } from 'react-native'

const cache = {}

export default {
  set: (key, value, useCache = true) => {
    const jsonValue = JSON.stringify(value)
    if (useCache) { cache[key] = jsonValue }
    return AsyncStorage.setItem(key, jsonValue)
  },

  get: async (key, useCache = true) => {
    if (useCache && (key in cache)) {
      return JSON.parse(cache[key])
    }
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        cache[key] = value
        return JSON.parse(value)
      }
      return null
    } catch (error) {
      return null
    }
  },
  remove: key => {
    delete cache[key]
    return AsyncStorage.removeItem(key)
  },
}
