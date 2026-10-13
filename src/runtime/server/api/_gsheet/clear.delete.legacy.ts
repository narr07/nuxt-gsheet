import { defineEventHandler } from 'h3'
import { helpers } from '../../utils/helpers.legacy'
import { createClearHandler } from '../../handlers/clear'

export default defineEventHandler(createClearHandler(helpers))
