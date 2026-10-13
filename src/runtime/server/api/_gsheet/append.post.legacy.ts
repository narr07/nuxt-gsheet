import { defineEventHandler } from 'h3'
import { helpers } from '../../utils/helpers.legacy'
import { createAppendHandler } from '../../handlers/append'

export default defineEventHandler(createAppendHandler(helpers))
