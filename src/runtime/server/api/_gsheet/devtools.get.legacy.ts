import { defineEventHandler } from 'h3'
import { renderDevtoolsPage } from '../../handlers/devtools'

export default defineEventHandler(() => renderDevtoolsPage())
