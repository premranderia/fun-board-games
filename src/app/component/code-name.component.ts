import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CodeBlock } from './code-block.factory';
import { ActivatedRoute, Params, UrlSegment, Router } from '@angular/router';
import { CodeBlockColor, GameView } from './code-block.constant';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample-2';
import { CodeBlockService } from './internal/code-block.service';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common';
import { SocketService } from '../socket/socket.service';
import { Event } from '../socket/socket-events';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  providers: [CodeBlockService, SocketService],
  styleUrls: ['./code-name.component.css', '../app.css']
})
export class CodeNameComponent implements OnInit {
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

  private gameView: GameView;
  private maxColor = 9;
  private minColor = 8;
  private noOfRows = 5;
  private noOfColumns = 5;
  private totalBlocks = this.noOfColumns * this.noOfRows;
  private ioConnection: any;
  private messages: Array<any>;
  private messageContent: string;

  constructor(private route: ActivatedRoute, private codeBlockService: CodeBlockService,
    private router: Router,
    private socketService: SocketService) {
    this.codeBlocks = [];
    this.colors = [];
    this.words = [];
    this.gameView = GameView.PLAYER;
  }

  async ngOnInit() {
    this.initSocket();
    this.loading = true;
    let gameId = undefined;

    // await vm.grid.ready;

    // vm.grid.ready.subscribe();
    this.route.queryParams
      // .toPromise();
      .subscribe((params: Params) => {
        if (params['spy'] && !!params['spy'] === true) {
          this.gameView = GameView.SPYMASTER;
        }
        if (params['id']) {
          this.getSavedCodeBlock(params['id']);
        }
        this.resetGame();
      });
  }

  public initSocket() {
    this.messages = [];

    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: any) => {
        if (message['id'] && message['id'] === this.gameId) {
          console.log(message);
          this.codeBlocks = message['blocks'];
        }
        // this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
      });
  }

  public sendMessage(message: any): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.gameId,
      message
    });
    this.messageContent = null;
  }

  public getSavedCodeBlock(id) {
    this.codeBlockService.getGame({
      id
    }).subscribe((data) => {
      this.disableSpyMode = data['spyViewCount'] > 1;
      // Turn of viewing the game if the spy mode is already on
      // if (this.disableSpyMode) {
      //   this.gameView = GameView.PLAYER;
      // }
      if (!_.isEmpty(data['blocks'])) {
        this.codeBlocks = _.map(data['blocks'], (elem) => {
          return new CodeBlock(elem);
        });
        this.gameId = id;
      }
    });
  }

  public resetGame() {
    this.gameResultColor = undefined;
    this.maxColorLeft = this.maxColor;
    this.minColorLeft = this.minColor;
    this.loading = true;
    this.gameId = _.random(1, 10000);
    this.codeBlocks.length = 0;
    this.shuffleColors();
    this.shuffleWords();
    this.createBlocks();
    this.saveBoard();
    this.loading = false;
  }

  public getBlock(id): CodeBlock {
    const block = new CodeBlock({
      color: this.colors[id],
      word: this.words[id],
      id
    });
    return block;
  }

  public createBlocks() {
    let i = 0;
    while (i < this.totalBlocks) {
      this.codeBlocks.push(this.getBlock(i));
      i++;
    }
  }

  public getClass(block: CodeBlock) {
    let css = undefined;
    css = (this.gameView === GameView.SPYMASTER && !this.loading) || block.clicked ? block.color : block.currentColor;
    if (block.clicked === true && this.isSpyMasterViewOn()) {
      css = `${css} clicked`;
    }
    return css;
  }

  public toggleGameView() {
    if (this.disableSpyMode === false) {
      this.gameView = this.gameView === GameView.SPYMASTER ? GameView.PLAYER : GameView.SPYMASTER;
      this.saveBoard();
    }
  }

  public isSpyMasterViewOn() {
    return this.gameView === GameView.SPYMASTER;
  }

  public onBlockClick(block: CodeBlock) {
    if (this.gameResultColor !== undefined || this.isSpyMasterViewOn()) {
      return;
    }
    block.clicked = true;
    this.saveBoard();
    this.isSpyMasterViewOn() === false ? block.currentColor = block.color : undefined;
    if (block.currentColor === CodeBlockColor.RED) {
      this.maxColorLeft--;
    } else if (block.currentColor === CodeBlockColor.BLUE) {
      this.minColorLeft--;
    } else if (block.currentColor === CodeBlockColor.BLACK) {
      this.gameResultColor = CodeBlockColor.BLACK;
      return;
    }
    this.updateScore();
  }

  public navigateToHome() {
    this.router.navigate(['']);
  }

  private updateScore() {
    if (this.maxColorLeft === 0) {
      this.gameResultColor = CodeBlockColor.RED;
    } else if (this.minColorLeft === 0) {
      this.gameResultColor = CodeBlockColor.BLUE;
    }
  }

  private shuffleColors() {
    const arr = [];

    arr.push(CodeBlockColor.BLACK);
    let maxColor = this.maxColor;
    while (maxColor > 0) {
      arr.push(CodeBlockColor.RED);
      maxColor--;
    }

    let minColor = this.minColor;
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

  private shuffleWords() {
    this.words = _.sampleSize(DATA, this.totalBlocks);
  }

  private saveBoard() {
    this.codeBlockService.storeGame({
      id: this.gameId,
      blocks: this.codeBlocks,
      spyViewCount: this.gameView === GameView.SPYMASTER ? 1 : 0,
    }).subscribe();
    this.sendMessage({
      id: this.gameId,
      blocks: this.codeBlocks
    });
  }
}
