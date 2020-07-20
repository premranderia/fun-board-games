import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CodeBlock } from './code-block.factory';
import { ActivatedRoute, Params, UrlSegment, Router } from '@angular/router';
import { CodeBlockColor, GameView } from './code-block.constant';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample';
import { DATA_GUJJU } from '../../assets/game-sample-3';
import { CodeBlockService } from './internal/code-block.service';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common';
import { SocketService } from '../socket/socket.service';
import { Event } from '../socket/socket-events';
import { ROUTES } from '../routes/route.constant';
import { QueryParams } from '../home-component/home-component';
@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  providers: [CodeBlockService, SocketService],
  styleUrls: ['./code-name.component.css', '../app.css'],
})
export class CodeNameComponent implements OnInit {
  @ViewChild('audioPlayerOnLoadSound') audioPlayerOnLoadSound: ElementRef;
  @ViewChild('audioLockSound') audioLockSound: ElementRef;
  @ViewChild('audioGameOverSound') audioGameOverSound: ElementRef;
  @ViewChild('audioGameWinnerSound') audioGameWinnerSound: ElementRef;

  MAX_COLOR = 9;
  MIN_COLOR = 8;
  NO_OF_ROWS = 5;
  NO_OF_COLUMNS = 5;
  AUDIO_SOUNDS = true;
  COUNT_DOWN_LIMIT = 120;

  public rows: Array<any>;
  public columns: Array<any>;
  public codeBlocks: Array<CodeBlock>;
  public colors: Array<CodeBlockColor>;
  public words: Array<string>;
  public gameId: number;
  public disableSpyMode = false;
  public loading = false;
  public maxColorLeft: number;
  public minColorLeft: number;
  public gameResultColor: CodeBlockColor;
  public CodeBlockColor = CodeBlockColor;
  public showAllCards = false;
  public spyViewCount = 0;
  public countDownLimit = 0;
  public homeCountDown: number;
  public enableGujjuView: boolean;

  private gameView: GameView;
  private totalBlocks = this.NO_OF_ROWS * this.NO_OF_COLUMNS;
  private ioConnection: any;
  private messages: Array<any>;
  private timeOutInterval: any;

  constructor(
    private route: ActivatedRoute,
    private codeBlockService: CodeBlockService,
    private router: Router,
    private socketService: SocketService
  ) {
    this.codeBlocks = [];
    this.gameId = undefined;
    this.colors = [];
    this.words = [];
    this.gameView = GameView.PLAYER;
    this.enableGujjuView = false;
  }

  async ngOnInit() {
    if (this.AUDIO_SOUNDS) {
      this.audioPlayerOnLoadSound.nativeElement.play();
    }
    this.initSocket();
    this.loading = true;
    this.route.queryParams
      // .toPromise();
      .subscribe(async (params: QueryParams) => {
        let id = params.id;
        if (params.spy && !!params.spy === true) {
          this.gameView = GameView.SPYMASTER;
        }
        if (id) {
          const blocksByGameID = await this.fetchCodeBlockByGameId(id);
          if (params.gujVersion && !!params.gujVersion === true) {
            this.enableGujjuView = true;
          }
          if (blocksByGameID && !_.isEmpty(blocksByGameID)) {
            this.codeBlocks = blocksByGameID;
            this.gameId = id;
          }
        }
        this.initGame({ id: this.gameId, blocks: this.codeBlocks });
      });
  }

  public initGame({ id, blocks, enableGujjuView }: GameData): void {
    this.gameResultColor = CodeBlockColor.NONE;
    this.maxColorLeft = this.MAX_COLOR;
    this.minColorLeft = this.MIN_COLOR;
    this.loading = true;
    this.gameId = id || _.random(1, 10000);
    this.shuffleColors();
    this.shuffleWords();
    this.resetCountDown(this.COUNT_DOWN_LIMIT);
    // This means we are reseting the board
    if (_.isUndefined(blocks) || _.isEmpty(blocks)) {
      this.codeBlocks.length = 0;
      this.createBlocks();
      this.saveBoard();
    }
    this.updateColorLeft();
    this.checkWinner();
    this.postGameOverAction();
    this.loading = false;
    this.homeCountDown = this.COUNT_DOWN_LIMIT / 2;
    this.enableGujjuView = enableGujjuView;
  }

  /**
   * This will make socket connection so spy master's board will be updated
   */
  public initSocket(): void {
    this.messages = [];
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message: GameData & { count: number }) => {
      if (message) {
        if (message.id && Number(message.id) === Number(this.gameId)) {
          this.codeBlocks = message.blocks;
          this.updateColorLeft();
        }
        if (message.gameResult) {
          this.gameResultColor = message.gameResult;
          this.postGameOverAction();
        }
      }
    });

    this.socketService.onEvent(Event.CONNECT).subscribe((message: any) => {});

    this.socketService.onEvent(Event.DISCONNECT).subscribe(() => {});
    this.socketService.getActiveClients();
  }

  /**
   * This will emit message to node
   * @param message This will emit
   */
  public sendMessage(message: GameData): void {
    if (!message) {
      return;
    }
    this.socketService.send({
      from: this.gameId,
      message,
    });
  }

  /**
   * Get css for the code block
   */
  public getCodeBlockClass(block: CodeBlock): string {
    let css = undefined;
    css = (this.gameView === GameView.SPYMASTER && !this.loading) || block.clicked ? block.color : block.currentColor;
    if (block.clicked === true && this.isSpyMasterViewOn()) {
      css = `${css} clicked`;
    }
    return css;
  }

  /**
   * Toggle spymaster view on/off
   */
  public toggleGameView(): void {
    if (this.disableSpyMode === false) {
      this.gameView = this.gameView === GameView.SPYMASTER ? GameView.PLAYER : GameView.SPYMASTER;
      this.saveBoard();
    }
  }

  public toggleGujjuVersion(): void {
    this.enableGujjuView = !this.enableGujjuView;
    this.initGame({ enableGujjuView: this.enableGujjuView });
  }

  /**
   * Returns if spymaster mode is on/off
   */
  public isSpyMasterViewOn(): boolean {
    return this.gameView === GameView.SPYMASTER;
  }

  /**
   * Returns if spymaster mode is on/off
   */
  public toggleShowAllCards(): void {
    this.showAllCards = !this.showAllCards;
  }

  /**
   * Action when a code block is clicked
   */
  public onBlockClick(block: CodeBlock): void {
    // Do no action when spy master mode is on game is won/over
    if (this.isBlockClickDisabled(block)) {
      return;
    }
    block.clicked = true;
    if (this.AUDIO_SOUNDS) {
      this.audioLockSound.nativeElement.play();
    }
    this.isSpyMasterViewOn() === false ? (block.currentColor = block.color) : undefined;
    this.updateColorLeft();
    this.checkWinner();
    this.postGameOverAction();
    this.playSound();
    this.resetCountDown(this.COUNT_DOWN_LIMIT);
    // Save the board state
    this.saveBoard();
  }

  /**
   * Navigate to home page
   */
  public navigateToHome(): void {
    this.router.navigate([ROUTES.HOME]);
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
  // If game is over then, route to home page for spymasters
  private postGameOverAction() {
    if (this.gameResultColor !== CodeBlockColor.NONE) {
      clearInterval(this.timeOutInterval);
      if (this.isSpyMasterViewOn()) {
        const interval = setInterval(() => {
          this.homeCountDown--;
          if (this.homeCountDown <= 0) {
            clearInterval(interval);
            this.navigateToHome();
          }
        }, 1000);
      }
    }
  }

  private playSound() {
    if (!this.AUDIO_SOUNDS) {
      return;
    }
    switch (this.gameResultColor) {
      case CodeBlockColor.RED:
      case CodeBlockColor.BLUE:
        this.audioGameWinnerSound.nativeElement.play();
        break;

      case CodeBlockColor.BLACK:
        this.audioGameOverSound.nativeElement.play();
        break;
      default:
    }
  }
  private isBlockClickDisabled(block: CodeBlock) {
    return this.gameResultColor !== CodeBlockColor.NONE || this.isSpyMasterViewOn() || block.clicked;
  }

  private updateColorLeft() {
    this.maxColorLeft = this.MAX_COLOR;
    this.minColorLeft = this.MIN_COLOR;

    this.codeBlocks.forEach((block: CodeBlock) => {
      if (block.clicked) {
        if (block.color === CodeBlockColor.RED) {
          this.maxColorLeft--;
        } else if (block.color === CodeBlockColor.BLUE) {
          this.minColorLeft--;
        } else if (block.color === CodeBlockColor.BLACK) {
          this.gameResultColor = CodeBlockColor.BLACK;
        }
      }
    });
  }

  /**
   * Update the score for the teams
   */
  private checkWinner(): void {
    if (this.maxColorLeft === 0) {
      this.gameResultColor = CodeBlockColor.RED;
    } else if (this.minColorLeft === 0) {
      this.gameResultColor = CodeBlockColor.BLUE;
    }
  }

  /**
   * Shuffle the colors array
   * TODO: Move this to factory
   */
  private shuffleColors(): void {
    const arr = [];

    arr.push(CodeBlockColor.BLACK);
    let maxColor = this.MAX_COLOR;
    while (maxColor > 0) {
      arr.push(CodeBlockColor.RED);
      maxColor--;
    }

    let minColor = this.MIN_COLOR;
    while (minColor > 0) {
      arr.push(CodeBlockColor.BLUE);
      minColor--;
    }

    let arrLength = arr.length;
    while (arrLength < this.totalBlocks) {
      arr.push(CodeBlockColor.YELLOW);
      arrLength++;
    }
    this.colors = _.shuffle(arr);
  }

  /**
   * Shuffle the words
   */
  private shuffleWords(): void {
    let wordPool: string[];
    this.words = _.sampleSize(DATA, this.totalBlocks);
    wordPool = this.enableGujjuView ? DATA_GUJJU : DATA;
    this.words = _.sampleSize(wordPool, this.totalBlocks);
  }

  /**
   * Save the board and emit the message for socket
   */
  private saveBoard(): void {
    this.codeBlockService
      .storeGame({
        id: this.gameId,
        blocks: this.codeBlocks,
        spyViewCount: this.gameView === GameView.SPYMASTER ? 1 : 0,
      })
      .subscribe();
    this.sendMessage({
      id: this.gameId,
      blocks: this.codeBlocks,
      gameResult: this.gameResultColor,
    });
  }

  /**
   * Fetch codeblocks by game id
   */
  private async fetchCodeBlockByGameId(id): Promise<Array<CodeBlock>> {
    let codeBlocks = undefined;
    const data: GameData = await this.codeBlockService.getGame({
      id,
    });
    // this.disableSpyMode = data['spyViewCount'] > 1;
    if (!_.isEmpty(data.blocks)) {
      codeBlocks = _.map(data.blocks, (elem) => {
        return new CodeBlock(elem);
      });
    }
    return codeBlocks;
  }

  /**
   * Create code blocks
   */
  private createBlocks(): void {
    let id = 0;
    while (id < this.totalBlocks) {
      this.codeBlocks.push(
        new CodeBlock({
          color: this.colors[id],
          word: this.words[id],
          id,
        })
      );
      id++;
    }
  }
}

export interface GameData {
  id?: number;
  blocks?: Array<CodeBlock>;
  spyViewCount?: number;
  gameResult?: CodeBlockColor;
  enableGujjuView?: boolean;
}
