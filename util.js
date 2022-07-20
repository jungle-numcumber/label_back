/*
Unlike stated in the LICENSE file, it is not necessary to include the copyright notice and permission notice when you copy code from this file.
*/

/**
 * @module provider/websocket
 */

/* eslint-env browser */

// import * as Y from 'yjs' // eslint-disable-line
// import * as bc from 'lib0/broadcastchannel'
// import * as time from 'lib0/time'
// import * as encoding from 'lib0/encoding'
// import * as decoding from 'lib0/decoding'
// import * as syncProtocol from 'y-protocols/sync'
// import * as authProtocol from 'y-protocols/auth'
// import * as awarenessProtocol from 'y-protocols/awareness'
// import { Observable } from 'lib0/observable'
// import * as math from 'lib0/math'
// import * as url from 'lib0/url'

// const messageSync = 0
// const messageQueryAwareness = 3
// const messageAwareness = 1
// const messageAuth = 2

// /**
//  *                       encoder,          decoder,          provider,          emitSynced, messageType
//  * @type {Array<function(encoding.Encoder, decoding.Decoder, WebsocketProvider, boolean,    number):void>}
//  */
// const messageHandlers = []

// messageHandlers[messageSync] = (encoder, decoder, provider, emitSynced, messageType) => {
//   encoding.writeVarUint(encoder, messageSync)
//   const syncMessageType = syncProtocol.readSyncMessage(decoder, encoder, provider.doc, provider)
//   if (emitSynced && syncMessageType === syncProtocol.messageYjsSyncStep2 && !provider.synced) {
//     provider.synced = true
//   }
// }

// messageHandlers[messageQueryAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
//   encoding.writeVarUint(encoder, messageAwareness)
//   encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(provider.awareness, Array.from(provider.awareness.getStates().keys())))
// }

// messageHandlers[messageAwareness] = (encoder, decoder, provider, emitSynced, messageType) => {
//   awarenessProtocol.applyAwarenessUpdate(provider.awareness, decoding.readVarUint8Array(decoder), provider)
// }

// messageHandlers[messageAuth] = (encoder, decoder, provider, emitSynced, messageType) => {
//   authProtocol.readAuthMessage(decoder, provider.doc, permissionDeniedHandler)
// }

// // @todo - this should depend on awareness.outdatedTime
// const messageReconnectTimeout = 30000

// /**
//  * @param {WebsocketProvider} provider
//  * @param {string} reason
//  */
// const permissionDeniedHandler = (provider, reason) => console.warn(`Permission denied to access ${provider.url}.\n${reason}`)

// /**
//  * @param {WebsocketProvider} provider
//  * @param {Uint8Array} buf
//  * @param {boolean} emitSynced
//  * @return {encoding.Encoder}
//  */
// const readMessage = (provider, buf, emitSynced) => {
//   const decoder = decoding.createDecoder(buf)
//   const encoder = encoding.createEncoder()
//   const messageType = decoding.readVarUint(decoder)
//   const messageHandler = provider.messageHandlers[messageType]
//   if (/** @type {any} */ (messageHandler)) {
//     messageHandler(encoder, decoder, provider, emitSynced, messageType)
//   } else {
//     console.error('Unable to compute message')
//   }
//   return encoder
// }

// /**
//  * @param {WebsocketProvider} provider
//  */
// const setupWS = provider => {
//   if (provider.shouldConnect && provider.ws === null) {
//     const websocket = new provider._WS(provider.url)
//     websocket.binaryType = 'arraybuffer'
//     provider.ws = websocket
//     provider.wsconnecting = true
//     provider.wsconnected = false
//     provider.synced = false

//     websocket.onmessage = event => {
//       provider.wsLastMessageReceived = time.getUnixTime()
//       const encoder = readMessage(provider, new Uint8Array(event.data), true)
//       if (encoding.length(encoder) > 1) {
//         websocket.send(encoding.toUint8Array(encoder))
//       }
//     }
//     websocket.onerror = event => {
//       provider.emit('connection-error', [event, provider])
//     }
//     websocket.onclose = event => {
//       provider.emit('connection-close', [event, provider])
//       provider.ws = null
//       provider.wsconnecting = false
//       if (provider.wsconnected) {
//         provider.wsconnected = false
//         provider.synced = false
//         // update awareness (all users except local left)
//         awarenessProtocol.removeAwarenessStates(provider.awareness, Array.from(provider.awareness.getStates().keys()).filter(client => client !== provider.doc.clientID), provider)
//         provider.emit('status', [{
//           status: 'disconnected'
//         }])
//       } else {
//         provider.wsUnsuccessfulReconnects++
//       }
//       // Start with no reconnect timeout and increase timeout by
//       // using exponential backoff starting with 100ms
//       setTimeout(setupWS, math.min(math.pow(2, provider.wsUnsuccessfulReconnects) * 100, provider.maxBackoffTime), provider)
//     }
//     websocket.onopen = () => {
//       provider.wsLastMessageReceived = time.getUnixTime()
//       provider.wsconnecting = false
//       provider.wsconnected = true
//       provider.wsUnsuccessfulReconnects = 0
//       provider.emit('status', [{
//         status: 'connected'
//       }])
//       // always send sync step 1 when connected
//       const encoder = encoding.createEncoder()
//       encoding.writeVarUint(encoder, messageSync)
//       syncProtocol.writeSyncStep1(encoder, provider.doc)
//       websocket.send(encoding.toUint8Array(encoder))
//       // broadcast local awareness state
//       if (provider.awareness.getLocalState() !== null) {
//         const encoderAwarenessState = encoding.createEncoder()
//         encoding.writeVarUint(encoderAwarenessState, messageAwareness)
//         encoding.writeVarUint8Array(encoderAwarenessState, awarenessProtocol.encodeAwarenessUpdate(provider.awareness, [provider.doc.clientID]))
//         websocket.send(encoding.toUint8Array(encoderAwarenessState))
//       }
//     }

//     provider.emit('status', [{
//       status: 'connecting'
//     }])
//   }
// }

// /**
//  * @param {WebsocketProvider} provider
//  * @param {ArrayBuffer} buf
//  */
// const broadcastMessage = (provider, buf) => {
//   if (provider.wsconnected) {
//     /** @type {WebSocket} */ (provider.ws).send(buf)
//   }
//   if (provider.bcconnected) {
//     bc.publish(provider.bcChannel, buf, provider)
//   }
// }

// /**
//  * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
//  * The document name is attached to the provided url. I.e. the following example
//  * creates a websocket connection to http://localhost:1234/my-document-name
//  *
//  * @example
//  *   import * as Y from 'yjs'
//  *   import { WebsocketProvider } from 'y-websocket'
//  *   const doc = new Y.Doc()
//  *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
//  *
//  * @extends {Observable<string>}
//  */
// export class WebsocketProvider extends Observable {
//   /**
//    * @param {string} serverUrl
//    * @param {string} roomname
//    * @param {Y.Doc} doc
//    * @param {object} [opts]
//    * @param {boolean} [opts.connect]
//    * @param {awarenessProtocol.Awareness} [opts.awareness]
//    * @param {Object<string,string>} [opts.params]
//    * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
//    * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
//    * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
//    * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
//    */
//   constructor (serverUrl, roomname, doc, {
//     connect = true,
//     awareness = new awarenessProtocol.Awareness(doc),
//     params = {},
//     WebSocketPolyfill = WebSocket,
//     resyncInterval = -1,
//     maxBackoffTime = 2500,
//     disableBc = false
//   } = {}) {
//     super()
//     // ensure that url is always ends with /
//     while (serverUrl[serverUrl.length - 1] === '/') {
//       serverUrl = serverUrl.slice(0, serverUrl.length - 1)
//     }
//     const encodedParams = url.encodeQueryParams(params)
//     this.maxBackoffTime = maxBackoffTime
//     this.bcChannel = serverUrl + '/' + roomname
//     this.url = serverUrl + '/' + roomname + (encodedParams.length === 0 ? '' : '?' + encodedParams)
//     this.roomname = roomname
//     this.doc = doc
//     this._WS = WebSocketPolyfill
//     this.awareness = awareness
//     this.wsconnected = false
//     this.wsconnecting = false
//     this.bcconnected = false
//     this.disableBc = disableBc
//     this.wsUnsuccessfulReconnects = 0
//     this.messageHandlers = messageHandlers.slice()
//     /**
//      * @type {boolean}
//      */
//     this._synced = false
//     /**
//      * @type {WebSocket?}
//      */
//     this.ws = null
//     this.wsLastMessageReceived = 0
//     /**
//      * Whether to connect to other peers or not
//      * @type {boolean}
//      */
//     this.shouldConnect = connect

//     /**
//      * @type {number}
//      */
//     this._resyncInterval = 0
//     if (resyncInterval > 0) {
//       this._resyncInterval = /** @type {any} */ (setInterval(() => {
//         if (this.ws && this.ws.readyState === WebSocket.OPEN) {
//           // resend sync step 1
//           const encoder = encoding.createEncoder()
//           encoding.writeVarUint(encoder, messageSync)
//           syncProtocol.writeSyncStep1(encoder, doc)
//           this.ws.send(encoding.toUint8Array(encoder))
//         }
//       }, resyncInterval))
//     }

//     /**
//      * @param {ArrayBuffer} data
//      * @param {any} origin
//      */
//     this._bcSubscriber = (data, origin) => {
//       if (origin !== this) {
//         const encoder = readMessage(this, new Uint8Array(data), false)
//         if (encoding.length(encoder) > 1) {
//           bc.publish(this.bcChannel, encoding.toUint8Array(encoder), this)
//         }
//       }
//     }
//     /**
//      * Listens to Yjs updates and sends them to remote peers (ws and broadcastchannel)
//      * @param {Uint8Array} update
//      * @param {any} origin
//      */
//     this._updateHandler = (update, origin) => {
//       if (origin !== this) {
//         const encoder = encoding.createEncoder()
//         encoding.writeVarUint(encoder, messageSync)
//         syncProtocol.writeUpdate(encoder, update)
//         broadcastMessage(this, encoding.toUint8Array(encoder))
//       }
//     }
//     this.doc.on('update', this._updateHandler)
//     /**
//      * @param {any} changed
//      * @param {any} origin
//      */
//     this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
//       const changedClients = added.concat(updated).concat(removed)
//       const encoder = encoding.createEncoder()
//       encoding.writeVarUint(encoder, messageAwareness)
//       encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(awareness, changedClients))
//       broadcastMessage(this, encoding.toUint8Array(encoder))
//     }
//     this._beforeUnloadHandler = () => {
//       awarenessProtocol.removeAwarenessStates(this.awareness, [doc.clientID], 'window unload')
//     }
//     if (typeof window !== 'undefined') {
//       window.addEventListener('beforeunload', this._beforeUnloadHandler)
//     } else if (typeof process !== 'undefined') {
//       process.on('exit', this._beforeUnloadHandler)
//     }
//     awareness.on('update', this._awarenessUpdateHandler)
//     this._checkInterval = /** @type {any} */ (setInterval(() => {
//       if (this.wsconnected && messageReconnectTimeout < time.getUnixTime() - this.wsLastMessageReceived) {
//         // no message received in a long time - not even your own awareness
//         // updates (which are updated every 15 seconds)
//         /** @type {WebSocket} */ (this.ws).close()
//       }
//     }, messageReconnectTimeout / 10))
//     if (connect) {
//       this.connect()
//     }
//   }

//   /**
//    * @type {boolean}
//    */
//   get synced () {
//     return this._synced
//   }

//   set synced (state) {
//     if (this._synced !== state) {
//       this._synced = state
//       this.emit('synced', [state])
//       this.emit('sync', [state])
//     }
//   }

//   destroy () {
//     if (this._resyncInterval !== 0) {
//       clearInterval(this._resyncInterval)
//     }
//     clearInterval(this._checkInterval)
//     this.disconnect()
//     if (typeof window !== 'undefined') {
//       window.removeEventListener('beforeunload', this._beforeUnloadHandler)
//     } else if (typeof process !== 'undefined') {
//       process.off('exit', this._beforeUnloadHandler)
//     }
//     this.awareness.off('update', this._awarenessUpdateHandler)
//     this.doc.off('update', this._updateHandler)
//     super.destroy()
//   }

//   connectBc () {
//     if (this.disableBc) {
//       return
//     }
//     if (!this.bcconnected) {
//       bc.subscribe(this.bcChannel, this._bcSubscriber)
//       this.bcconnected = true
//     }
//     // send sync step1 to bc
//     // write sync step 1
//     const encoderSync = encoding.createEncoder()
//     encoding.writeVarUint(encoderSync, messageSync)
//     syncProtocol.writeSyncStep1(encoderSync, this.doc)
//     bc.publish(this.bcChannel, encoding.toUint8Array(encoderSync), this)
//     // broadcast local state
//     const encoderState = encoding.createEncoder()
//     encoding.writeVarUint(encoderState, messageSync)
//     syncProtocol.writeSyncStep2(encoderState, this.doc)
//     bc.publish(this.bcChannel, encoding.toUint8Array(encoderState), this)
//     // write queryAwareness
//     const encoderAwarenessQuery = encoding.createEncoder()
//     encoding.writeVarUint(encoderAwarenessQuery, messageQueryAwareness)
//     bc.publish(this.bcChannel, encoding.toUint8Array(encoderAwarenessQuery), this)
//     // broadcast local awareness state
//     const encoderAwarenessState = encoding.createEncoder()
//     encoding.writeVarUint(encoderAwarenessState, messageAwareness)
//     encoding.writeVarUint8Array(encoderAwarenessState, awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID]))
//     bc.publish(this.bcChannel, encoding.toUint8Array(encoderAwarenessState), this)
//   }

//   disconnectBc () {
//     // broadcast message with local awareness state set to null (indicating disconnect)
//     const encoder = encoding.createEncoder()
//     encoding.writeVarUint(encoder, messageAwareness)
//     encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, [this.doc.clientID], new Map()))
//     broadcastMessage(this, encoding.toUint8Array(encoder))
//     if (this.bcconnected) {
//       bc.unsubscribe(this.bcChannel, this._bcSubscriber)
//       this.bcconnected = false
//     }
//   }

//   disconnect () {
//     this.shouldConnect = false
//     this.disconnectBc()
//     if (this.ws !== null) {
//       this.ws.close()
//     }
//   }

//   connect () {
//     this.shouldConnect = true
//     if (!this.wsconnected && this.ws === null) {
//       setupWS(this)
//       this.connectBc()
//     }
//   }
// }

const Y = require('yjs')
const syncProtocol = require('y-protocols/dist/sync.cjs')
const awarenessProtocol = require('y-protocols/dist/awareness.cjs')

const encoding = require('lib0/dist/encoding.cjs')
const decoding = require('lib0/dist/decoding.cjs')
const mutex = require('lib0/dist/mutex.cjs')
const map = require('lib0/dist/map.cjs')

const debounce = require('lodash.debounce')

const callbackHandler = require('./callback.js').callbackHandler
const isCallbackSet = require('./callback.js').isCallbackSet

const CALLBACK_DEBOUNCE_WAIT = parseInt(process.env.CALLBACK_DEBOUNCE_WAIT) || 2000
const CALLBACK_DEBOUNCE_MAXWAIT = parseInt(process.env.CALLBACK_DEBOUNCE_MAXWAIT) || 10000

const wsReadyStateConnecting = 0
const wsReadyStateOpen = 1
const wsReadyStateClosing = 2 // eslint-disable-line
const wsReadyStateClosed = 3 // eslint-disable-line

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0'
const persistenceDir = process.env.YPERSISTENCE
/**
 * @type {{bindState: function(string,WSSharedDoc):void, writeState:function(string,WSSharedDoc):Promise<any>, provider: any}|null}
 */
let persistence = null
if (typeof persistenceDir === 'string') {
  console.info('Persisting documents to "' + persistenceDir + '"')
  // @ts-ignore
  const LeveldbPersistence = require('y-leveldb').LeveldbPersistence
  const ldb = new LeveldbPersistence(persistenceDir)
  persistence = {
    provider: ldb,
    bindState: async (docName, ydoc) => {
      const persistedYdoc = await ldb.getYDoc(docName)
      const newUpdates = Y.encodeStateAsUpdate(ydoc)
      ldb.storeUpdate(docName, newUpdates)
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
      ydoc.on('update', update => {
        ldb.storeUpdate(docName, update)
      })
    },
    writeState: async (docName, ydoc) => {}
  }
}

/**
 * @param {{bindState: function(string,WSSharedDoc):void,
 * writeState:function(string,WSSharedDoc):Promise<any>,provider:any}|null} persistence_
 */
exports.setPersistence = persistence_ => {
  persistence = persistence_
}

/**
 * @return {null|{bindState: function(string,WSSharedDoc):void,
  * writeState:function(string,WSSharedDoc):Promise<any>}|null} used persistence layer
  */
exports.getPersistence = () => persistence

/**
 * @type {Map<string,WSSharedDoc>}
 */
const docs = new Map()
// exporting docs so that others can use it
exports.docs = docs

const messageSync = 0
const messageAwareness = 1
// const messageAuth = 2

/**
 * @param {Uint8Array} update
 * @param {any} origin
 * @param {WSSharedDoc} doc
 */
const updateHandler = (update, origin, doc) => {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, messageSync)
  syncProtocol.writeUpdate(encoder, update)
  const message = encoding.toUint8Array(encoder)
  doc.conns.forEach((_, conn) => send(doc, conn, message))
}

class WSSharedDoc extends Y.Doc {
  /**
   * @param {string} name
   */
  constructor (name) {
    super({ gc: gcEnabled })
    this.name = name
    this.mux = mutex.createMutex()
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    this.conns = new Map()
    /**
     * @type {awarenessProtocol.Awareness}
     */
    this.awareness = new awarenessProtocol.Awareness(this)
    this.awareness.setLocalState(null)
    /**
     * @param {{ added: Array<number>, updated: Array<number>, removed: Array<number> }} changes
     * @param {Object | null} conn Origin is the connection that made the change
     */
    const awarenessChangeHandler = ({ added, updated, removed }, conn) => {
      const changedClients = added.concat(updated, removed)
      if (conn !== null) {
        const connControlledIDs = /** @type {Set<number>} */ (this.conns.get(conn))
        if (connControlledIDs !== undefined) {
          added.forEach(clientID => { connControlledIDs.add(clientID) })
          removed.forEach(clientID => { connControlledIDs.delete(clientID) })
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients))
      const buff = encoding.toUint8Array(encoder)
      this.conns.forEach((_, c) => {
        send(this, c, buff)
      })
    }
    this.awareness.on('update', awarenessChangeHandler)
    this.on('update', updateHandler)
    if (isCallbackSet) {
      this.on('update', debounce(
        callbackHandler,
        CALLBACK_DEBOUNCE_WAIT,
        { maxWait: CALLBACK_DEBOUNCE_MAXWAIT }
      ))
    }
  }
}

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docname - the name of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
const getYDoc = (docname, gc = true) => map.setIfUndefined(docs, docname, () => {
  const doc = new WSSharedDoc(docname)
  doc.gc = gc
  if (persistence !== null) {
    persistence.bindState(docname, doc)
  }
  docs.set(docname, doc)
  return doc
})

exports.getYDoc = getYDoc

/**
 * @param {any} conn
 * @param {WSSharedDoc} doc
 * @param {Uint8Array} message
 */
const messageListener = (conn, doc, message) => {
  try {
    const encoder = encoding.createEncoder()
    const decoder = decoding.createDecoder(message)
    const messageType = decoding.readVarUint(decoder)
    switch (messageType) {
      case messageSync:
        encoding.writeVarUint(encoder, messageSync)
        syncProtocol.readSyncMessage(decoder, encoder, doc, null)
        if (encoding.length(encoder) > 1) {
          send(doc, conn, encoding.toUint8Array(encoder))
        }
        break
      case messageAwareness: {
        awarenessProtocol.applyAwarenessUpdate(doc.awareness, decoding.readVarUint8Array(decoder), conn)
        break
      }
    }
  } catch (err) {
    console.error(err)
    doc.emit('error', [err])
  }
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 */
const closeConn = (doc, conn) => {
  if (doc.conns.has(conn)) {
    /**
     * @type {Set<number>}
     */
    // @ts-ignore
    const controlledIds = doc.conns.get(conn)
    doc.conns.delete(conn)
    awarenessProtocol.removeAwarenessStates(doc.awareness, Array.from(controlledIds), null)
    if (doc.conns.size === 0 && persistence !== null) {
      // if persisted, we store state and destroy ydocument
      persistence.writeState(doc.name, doc).then(() => {
        doc.destroy()
      })
      docs.delete(doc.name)
    }
  }
  conn.close()
}

/**
 * @param {WSSharedDoc} doc
 * @param {any} conn
 * @param {Uint8Array} m
 */
const send = (doc, conn, m) => {
  if (conn.readyState !== wsReadyStateConnecting && conn.readyState !== wsReadyStateOpen) {
    closeConn(doc, conn)
  }
  try {
    conn.send(m, /** @param {any} err */ err => { err != null && closeConn(doc, conn) })
  } catch (e) {
    closeConn(doc, conn)
  }
}

const pingTimeout = 30000

/**
 * @param {any} conn
 * @param {any} req
 * @param {any} opts
 */
exports.setupWSConnection = (conn, req, { docName = req.url.slice(1).split('?')[0], gc = true } = {}) => {
  conn.binaryType = 'arraybuffer'
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docName, gc)
  doc.conns.set(conn, new Set())
  // listen and reply to events
  conn.on('message', /** @param {ArrayBuffer} message */ message => messageListener(conn, doc, new Uint8Array(message)))

  // Check if connection is still alive
  let pongReceived = true
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn)
      }
      clearInterval(pingInterval)
    } else if (doc.conns.has(conn)) {
      pongReceived = false
      try {
        conn.ping()
      } catch (e) {
        closeConn(doc, conn)
        clearInterval(pingInterval)
      }
    }
  }, pingTimeout)
  conn.on('close', () => {
    closeConn(doc, conn)
    clearInterval(pingInterval)
  })
  conn.on('pong', () => {
    pongReceived = true
  })
  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder()
    encoding.writeVarUint(encoder, messageSync)
    syncProtocol.writeSyncStep1(encoder, doc)
    send(doc, conn, encoding.toUint8Array(encoder))
    const awarenessStates = doc.awareness.getStates()
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, messageAwareness)
      encoding.writeVarUint8Array(encoder, awarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(awarenessStates.keys())))
      send(doc, conn, encoding.toUint8Array(encoder))
    }
  }
}