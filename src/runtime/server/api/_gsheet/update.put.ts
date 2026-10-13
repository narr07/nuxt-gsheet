import { defineEventHandler } from 'nuxt/server'
import { helpers } from '../../utils/helpers'
import { createUpdateHandler } from '../../handlers/update'

export default defineEventHandler(createUpdateHandler(helpers))
