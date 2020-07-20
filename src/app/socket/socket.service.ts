import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Event } from './socket-events';
import { environment } from '../../environments/environment';

import * as socketIo from 'socket.io-client';

const SERVER_URL = `${environment.serverUrl}`;

@Injectable()
export class SocketService {
  private socket;
  private room = 'message';

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
  }

  public send({ message }: any): void {
    this.socket.emit(this.room, message);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on(this.room, (data: any) => observer.next(data));
    });
  }

  public getActiveClients() {
    // return this.socket.clients(this.room);
  }

  public onEvent(event: Event): Observable<any> {
    return new Observable<Event>((observer) => {
      this.socket.on(event, () => observer.next());
    });
  }
}
