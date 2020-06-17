import browserEngine from './rest/browser.engine'
import serverEngine from './rest/server.engine'
import { isBrowser, isNode } from 'browser-or-node'

export default isNode ? serverEngine : browserEngine
