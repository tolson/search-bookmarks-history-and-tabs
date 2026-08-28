import { initialize } from '@pendo/web-sdk'

const STORAGE_KEY = 'pendoVisitorId'

async function getOrCreateVisitorId() {
  const stored = await chrome.storage.local.get(STORAGE_KEY)
  if (stored[STORAGE_KEY]) {
    return stored[STORAGE_KEY]
  }
  const id = crypto.randomUUID()
  await chrome.storage.local.set({ [STORAGE_KEY]: id })
  return id
}

getOrCreateVisitorId().then((visitorId) => {
  initialize({
    publicAppId: '1e518db5-ad89-41a8-a604-0ff7071a2afd',
    env: 'io',
    contentHost: 'cdn.pendo-dev.pendo-dev.com',
    dataHost: 'data.pendo-dev.pendo-dev.com',
    visitor: {
      id: visitorId,
    },
    assets: {
      host: chrome.runtime.getURL('').slice(0, -1),
      path: 'popup/pendo',
      localOnly: true,
    },
  })
})
