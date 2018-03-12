import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CodeBlock } from './code-block.factory';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { CodeBlockColor, GameView } from './code-block.constant';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample';
import { CodeBlockService } from './internal/code-block.service';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  providers: [CodeBlockService],
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

  constructor(private route: ActivatedRoute, private codeBlockService: CodeBlockService) {
    this.codeBlocks = [];
    this.colors = [];
    this.words = [];
    this.gameView = GameView.PLAYER;
  }

  async ngOnInit() {
    this.loading = true;
    let gameId = undefined;
    this.route.queryParams
      .subscribe((params: Params) => {
        if (params['spy'] && !!params['spy'] === true) {
          this.gameView = GameView.SPYMASTER;
        }
        if (params['id']) {
          this.getSavedCodeBlock(params['id']);
        }
        this.reset();
      });

    // const audio = new Audio();
    // audio.src = '../../kbc.mp3';
    // audio.load();
    // audio.play();
  }

  public getSavedCodeBlock(id) {
    this.codeBlockService.getGame({
      id
    }).subscribe((data) => {
      this.disableSpyMode = data['spyViewCount'] > 1;
      // Turn of viewing the game if the spy mode is already on
      if (this.disableSpyMode) {
        this.gameView = GameView.PLAYER;
      }
      if (!_.isEmpty(data['blocks'])) {
        this.codeBlocks = _.map(data['blocks'], (elem) => {
          return new CodeBlock(elem);
        });
        this.gameId = id;
      }
    });
  }

  public reset() {
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
    return (this.gameView === GameView.SPYMASTER && !this.loading) || block.clicked ? block.color : block.currentColor;
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
    if (this.gameResultColor !== undefined) {
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
  }

}
