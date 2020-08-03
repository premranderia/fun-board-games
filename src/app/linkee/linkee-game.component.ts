import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment, Router } from '@angular/router';
import { Event } from '../socket/socket-events';
import * as _ from 'lodash';
import { SocketService } from '../socket/socket.service';
import { QueryParams, Players } from '../linkee-home-component/linkee-home-component';
import { ROUTES } from '../routes/route.constant';
import { LinkeeGameService } from './internal/linkee-game.service';
import { GameView } from '../component/code-block.constant';

@Component({
  selector: 'linkee-game',
  templateUrl: `./linkee-game.component.html`,
  providers: [SocketService, LinkeeGameService],
  styleUrls: ['./linkee-game.component.css', '../app.css'],
})
export class LinkeeGameComponent implements OnInit {
  COUNT_DOWN_LIMIT = 120;
  score = {
    L: 0,
    I: 0,
    N: 0,
    K: 0,
    E: 0,
  };
  public loading: boolean;
  public gameId: number;
  public players: Array<any>;
  public cards: Cards[];
  public currentCard: number;
  public _ = _;
  public isGameOver = false;
  public optionHidden = {};
  public gameView;
  public countDownLimit = 0;
  public playerWhoWon: Players;
  private messages: Array<any>;
  private ioConnection: any;
  private defaultPlayer: Players = {
    name: 'Player 1',
    score: _.clone(this.score),
  };

  private timeOutInterval: any;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private router: Router,
    private linkeeGameService: LinkeeGameService
  ) {
    this.gameId = undefined;
  }

  ngOnInit() {
    this.initSocket();
    this.loading = true;
    this.route.queryParams
      // .toPromise();
      .subscribe(async (params: QueryParams) => {
        let id = params.id;
        let gameData: LinkeeGameData = {};
        if (params.players) {
          this.players = JSON.parse(params.players);
        }
        if (id) {
          gameData = await this.fetchGameData({ id });
        }
        if (params.spy && !!params.spy === true) {
          gameData.gameView = GameView.SPYMASTER;
        }
        console.log(id, gameData);
        await this.initGame(gameData);
      });
  }

  public async initGame({ id, currentCard, gameView, cards, playerWhoWon, isGameOver, players }: LinkeeGameData) {
    if (_.isUndefined(cards)) {
      const questionsRes = await this.linkeeGameService.getQuestions();
      this.cards = _.shuffle(questionsRes);
    } else {
      this.cards = cards;
    }
    this.currentCard = currentCard || 0;
    this.gameId = id || _.random(1, 10000);
    this.gameView = gameView || GameView.PLAYER;
    if (_.isEmpty(players)) {
      const player2: Players = _.clone(this.defaultPlayer);
      player2.name = 'Player 2';
      this.players = [this.defaultPlayer, player2];
    } else {
      this.players = players;
    }
    this.resetScore(this.players);
    this.resetOptionHidden();
    this.playerWhoWon = playerWhoWon || undefined;
    this.isGameOver = isGameOver || false;
    this.saveBoard();
  }

  public initSocket(): void {
    this.messages = [];
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message: LinkeeGameData) => {
      if (message.players) {
        this.players = message.players;
      }
      if (message.currentCard) {
        this.currentCard = message.currentCard;
      }
      if (message.playerWhoWon) {
        this.playerWhoWon = message.playerWhoWon;
      }
      if (message.isGameOver) {
        this.isGameOver = message.isGameOver;
      }
    });

    this.socketService.onEvent(Event.CONNECT).subscribe((message: any) => { });

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => { });
    this.socketService.getActiveClients();
  }

  public async fetchGameData({ id }): Promise<LinkeeGameData> {
    let game = await this.linkeeGameService.getGame({ id });
    return game;
  }

  public navigateToHome() {
    this.router.navigate([ROUTES.HOME]);
  }

  public sendMessage(message: LinkeeGameData): void {
    if (!message) {
      return;
    }
    console.log(message);
    this.socketService.send({
      from: message.id,
      message,
    });
  }

  public goToNextQuestion() {
    // Only normal screen can go next;
    if (this.isSpyMasterViewOn()) {
      return false;
    }
    this.currentCard++;
    this.resetOptionHidden();
    this.saveBoard();
  }

  public showOption(id) {
    this.resetCountDown(this.COUNT_DOWN_LIMIT);
    this.optionHidden[id] = false;
  }

  public resetOptionHidden() {
    if (this.isSpyMasterViewOn()) {
      this.optionHidden = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      };
    } else {
      this.optionHidden = {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
      };
    }
  }

  public toggleGameView() {
    this.gameView = this.gameView === GameView.SPYMASTER ? GameView.PLAYER : GameView.SPYMASTER;
    this.resetOptionHidden();
    this.saveBoard();
  }

  public isSpyMasterViewOn() {
    return this.gameView === GameView.SPYMASTER;
  }

  public updateScore(player: Players) {
    if (!_.isUndefined(this.cards[this.currentCard].player)) {
      console.debug('Score Assigned');
      return;
    }
    this.cards[this.currentCard].player = player;
    player.score[this.cards[this.currentCard].value]++;
    this.isGameOver = this.isPlayerWon(player);
    this.saveBoard();
  }

  private resetScore(players: Players[]) {
    _.each(players, (player: Players) => {
      player.score = _.clone(this.score);
    });
  }

  private isPlayerWon(player: Players) {
    let isWon = true;
    for (const key in player.score) {
      if (player.score[key] === 0) {
        isWon = false;
        break;
      }
      if (key === 'E' && player.score[key] < 2) {
        isWon = false;
        break;
      }
    }
    this.playerWhoWon = player;
    return isWon;
  }

  private resetCountDown(limit) {
    if (!_.isUndefined(this.timeOutInterval)) {
      clearInterval(this.timeOutInterval);
    }
    this.countDownLimit = limit;
    // const seconds = 50;
    this.timeOutInterval = setInterval(() => {
      this.countDownLimit--;
      if (this.countDownLimit <= 0) {
        clearInterval(this.timeOutInterval);
      }
    }, 1000);
  }

  private saveBoard(): void {
    const linkeGameData = {
      id: this.gameId,
      players: this.players,
      currentCard: this.currentCard,
      cards: this.cards,
      isGameOver: this.isGameOver,
      playerWhoWon: this.playerWhoWon,
    };
    this.linkeeGameService
      .storeGame(linkeGameData)
      .subscribe();

    this.sendMessage(linkeGameData);
  }
}

export interface LinkeeGameData {
  id?: number;
  players?: Players[];
  currentCard?: number;
  cards?: Cards[];
  gameView?: GameView;
  isGameOver?: boolean;
  playerWhoWon?: Players;
}

export interface Cards {
  value: string;
  questions: string[];
  player: Players;
}
