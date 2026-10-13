import { defineEventHandler } from 'h3'
import { helpers } from '../../utils/helpers.legacy'
import { createUpdateHandler } from '../../handlers/update'

export default defineEventHandler(createUpdateHandler(helpers))
