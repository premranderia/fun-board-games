import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QueryParams } from '../home-component/home-component';
import { ActivatedRoute, Params, UrlSegment, Router } from '@angular/router';
import { Event } from '../socket/socket-events';
import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'linkee-game',
  templateUrl: `./linkee-game.component.html`,
  providers: [SocketService],
  styleUrls: ['./linkee-game.component.css', '../app.css']
})

export class LinkeeGameComponent implements OnInit {
  public loading: boolean;
  public gameId: number;
  public players: Array<any>;
  public questions: string[];
  public _ = _;
  private messages: Array<any>;
  private ioConnection: any;

  constructor(private route: ActivatedRoute, private socketService: SocketService) {
    this.gameId = undefined;
  }

  ngOnInit() {
    this.initSocket();
    this.loading = true;
    this.route.queryParams
      // .toPromise();
      .subscribe(async (params: QueryParams) => {
        let id = params.id;
        if (id) {
          const blocksByGameID = await this.fetchGameData({ id });
          if (blocksByGameID && !_.isEmpty(blocksByGameID)) {
            this.gameId = id;
          }
        }
        this.initGame({ id: this.gameId });
      });
  }

  public initGame({ id }) {
    this.players = [{
      name: 'PREM',
      result: {
        L: 0,
        I: 0,
        N: 0,
        K: 0,
        E: 0,
      }
    }, {
      name: 'RADHA',
      result: {
        L: 0,
        I: 0,
        N: 0,
        K: 0,
        E: 0,
      }
    }, {
      name: 'Mehul',
      result: {
        L: 0,
        I: 0,
        N: 0,
        K: 0,
        E: 0,
      }
    }, {
      name: 'Namita',
      result: {
        L: 0,
        I: 0,
        N: 0,
        K: 0,
        E: 0,
      }
    }, {
      name: 'Jay',

    }];
    this.questions = ['What is the first questions ?', 'What is second question ?', 'What is the third question ?', 'What is the fourth question ?', 'Clue', 'answer'];
  }

  public initSocket(): void {
    this.messages = [];
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message) => {
        if (message) {
        }
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe((message: any) => {
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
    this.socketService.getActiveClients();
  }

  public async fetchGameData({ id }) {

  }

}