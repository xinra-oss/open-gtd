import { AppStore } from '../store'

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

    this.ws.addEventListener('open', event => {
      this.ws.send('Hello!')
    })
  }
  public setStore(store: AppStore) {
    this.store = store
  }
}
