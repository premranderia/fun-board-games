import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Params, UrlSegment, Router } from "@angular/router";
import { Event } from "../socket/socket-events";
import * as _ from "lodash";
import { SocketService } from "../socket/socket.service";
import {
  QueryParams,
  Players,
} from "../linkee-home-component/linkee-home-component";
import { ROUTES } from "../routes/route.constant";
import { LinkeeGameService } from "./internal/linkee-game.service";
import { GameView } from "../component/code-block.constant";

@Component({
  selector: "linkee-game",
  templateUrl: `./linkee-game.component.html`,
  providers: [SocketService, LinkeeGameService],
  styleUrls: ["./linkee-game.component.css", "../app.css"],
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
    name: "PREM",
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

        if (params.players) {
          this.players = JSON.parse(params.players);
        }
        if (id) {
          const gameData: LinkeeGameData = await this.fetchGameData({ id });
          if (gameData.players) {
            this.players = gameData.players;
          }
          if (params.spy && !!params.spy === true) {
            this.gameView = GameView.SPYMASTER;
          }
          if (gameData.currentCard) {
            this.currentCard = gameData.currentCard;
          }
          if (gameData.cards) {
            this.cards = gameData.cards;
          }
          this.gameId = id;
        }
        await this.initGame({
          id: this.gameId,
          currentCard: this.currentCard,
          gameView: this.gameView,
          cards: this.cards,
        });
      });
  }

  public async initGame({ id, currentCard, gameView, cards }) {
    if (_.isUndefined(cards)) {
      const questionsRes = await this.linkeeGameService.getQuestions();
      this.cards = _.shuffle(questionsRes);
    }
    this.currentCard = currentCard || 0;
    this.gameId = id || _.random(1, 10000);
    this.gameView = gameView || GameView.PLAYER;
    if (_.isEmpty(this.players)) {
      this.players = [this.defaultPlayer];
    }
    this.resetScore(this.players);
    this.resetOptionHidden();
    this.playerWhoWon = undefined;
    this.isGameOver = false;
    this.saveBoard();
  }

  public initSocket(): void {
    this.messages = [];
    this.socketService.initSocket();
    this.ioConnection = this.socketService
      .onMessage()
      .subscribe((message: LinkeeGameData) => {
        if (message.players) {
          this.players = message.players;
        }
        if (message.currentCard) {
          this.currentCard = message.currentCard;
        }
      });

    this.socketService.onEvent(Event.CONNECT).subscribe((message: any) => {});

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {});
    this.socketService.getActiveClients();
  }

  public async fetchGameData({ id }): Promise<LinkeeGameData> {
    let game = await this.linkeeGameService.getGame({ id });
    return game;
  }

  public navigateToHome() {
    this.router.navigate([ROUTES.LINKEE_HOME]);
  }

  public sendMessage(message: LinkeeGameData): void {
    if (!message) {
      return;
    }
    this.socketService.send({
      from: message.id,
      message,
    });
  }

  public goToNextQuestion() {
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
    this.gameView =
      this.gameView === GameView.SPYMASTER
        ? GameView.PLAYER
        : GameView.SPYMASTER;
    this.resetOptionHidden();
    this.saveBoard();
  }

  public isSpyMasterViewOn() {
    return this.gameView === GameView.SPYMASTER;
  }

  public updateScore(player: Players) {
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
    this.linkeeGameService
      .storeGame({
        id: this.gameId,
        players: this.players,
        currentCard: this.currentCard,
        cards: this.cards,
      })
      .subscribe();

    this.sendMessage({
      id: this.gameId,
      players: this.players,
      currentCard: this.currentCard,
      cards: this.cards,
    });
  }
}

export interface LinkeeGameData {
  id: number;
  players: Players[];
  currentCard: number;
  cards: Cards[];
}

export interface Cards {
  value: string;
  questions: string[];
}
