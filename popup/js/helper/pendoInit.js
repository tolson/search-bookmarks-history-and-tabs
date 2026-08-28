import { browserApi } from './browserApi.js'

const VISITOR_ID_KEY = 'pendoVisitorId'

function getOrCreateVisitorId() {
  return new Promise((resolve) => {
    browserApi.storage.local.get([VISITOR_ID_KEY], (result) => {
      if (result[VISITOR_ID_KEY]) {
        resolve(result[VISITOR_ID_KEY])
        return
      }
      const id = crypto.randomUUID()
      browserApi.storage.local.set({ [VISITOR_ID_KEY]: id }, () => resolve(id))
    })
  })
}

export async function initPendo() {
  try {
    const { initialize } = await import('@pendo/web-sdk')
    const visitorId = await getOrCreateVisitorId()
    initialize({
      publicAppId: '1e518db5-ad89-41a8-a604-0ff7071a2afd',
      env: 'io',
      contentHost: 'cdn.pendo-dev.pendo-dev.com',
      dataHost: 'data.pendo-dev.pendo-dev.com',
      visitor: {
        id: visitorId,
      },
      assets: {
        host: browserApi.runtime.getURL('').slice(0, -1),
        path: '/popup/pendo',
        localOnly: true,
      },
    })
  } catch {
    console.warn('Pendo SDK could not be initialized')
  }
}
