import { defineEventHandler } from 'h3'
import { helpers } from '../../utils/helpers.legacy'
import { createMetricsHandler } from '../../handlers/metrics'

export default defineEventHandler(createMetricsHandler(helpers))
