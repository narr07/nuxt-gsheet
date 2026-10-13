import { defineEventHandler } from 'nuxt/server'
import { helpers } from '../../../utils/helpers'
import { createValuesHandler } from '../../../handlers/values'

export default defineEventHandler(createValuesHandler(helpers))
