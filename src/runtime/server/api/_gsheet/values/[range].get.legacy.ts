import { defineEventHandler } from 'h3'
import { helpers } from '../../../utils/helpers.legacy'
import { createValuesHandler } from '../../../handlers/values'

export default defineEventHandler(createValuesHandler(helpers))
