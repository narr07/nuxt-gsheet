import { defineEventHandler } from 'nuxt/server'
import { helpers } from '../../utils/helpers'
import { createMetricsHandler } from '../../handlers/metrics'

export default defineEventHandler(createMetricsHandler(helpers))
