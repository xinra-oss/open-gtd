import { AppStore } from '../store'
import { syncActions } from '../store/actions'

export interface SyncService {
  start(): void
  setStore(store: AppStore): void
}

export class WebsocketSync implements SyncService {
  private ws: WebSocket
  private store = {} as AppStore
  public constructor(private url: string) {}
  public start() {
    this.ws = new WebSocket(this.url)
    this.store.getState()

    this.ws.addEventListener('message', event => {
      this.store.dispatch(syncActions.receivedSyncEvent(event.data))
    })
  }
  public setStore(store: AppStore) {
    this.store = store
  }
}
