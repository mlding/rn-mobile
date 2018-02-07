import { isNil } from 'lodash'

export const EMPTY_TEXT = '--'

export const getShowText = input => ((isNil(input) || input === '') ? EMPTY_TEXT : input)
