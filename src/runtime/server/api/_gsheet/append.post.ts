import { defineEventHandler } from 'nuxt/server'
import { helpers } from '../../utils/helpers'
import { createAppendHandler } from '../../handlers/append'

export default defineEventHandler(createAppendHandler(helpers))
