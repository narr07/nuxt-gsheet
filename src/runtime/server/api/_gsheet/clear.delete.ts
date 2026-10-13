import { defineEventHandler } from 'nuxt/server'
import { helpers } from '../../utils/helpers'
import { createClearHandler } from '../../handlers/clear'

export default defineEventHandler(createClearHandler(helpers))
