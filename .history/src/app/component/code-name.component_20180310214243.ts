import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CodeBlock } from './code-block.factory';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { CodeBlockColor, GameView } from './code-block.constant';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styleUrls: ['./code-name.component.css', '../app.css']
})
export class CodeNameComponent implements OnInit {
  public rows: Array<any>;
  public columns: Array<any>;
  public codeBlocks: Array<CodeBlock>;
  public colors: Array<CodeBlockColor>;
  public words: Array<string>;
  private gameView: GameView;
  private maxColor = 9;
  private minColor = 8;
  private noOfRows = 5;
  private noOfColumns = 5;
  private totalBlocks = this.noOfColumns * this.noOfRows;

  constructor(private route: ActivatedRoute) {
    this.codeBlocks = [];
    this.colors = [];
    this.words = [];
    // console.log(route.snapshot);
    this.gameView = GameView.PLAYER;
    this.reset();
  }

  ngOnInit() {
    let gameId = undefined;
    this.route.queryParams
      .subscribe((params: Params) => {
        if (params['spy'] && !!params['spy'] === true) {
          this.gameView = GameView.SPYMASTER;
        }
      });

    console.log(this.route.snapshot.data);
  }

  public reset() {
    this.codeBlocks.length = 0;
    this.shuffleColors();
    this.shuffleWords();
    this.createBlocks();
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
    return this.gameView === GameView.SPYMASTER ? block.color : block.currentColor;
  }

  public toggleGameView() {
    this.gameView = this.gameView === GameView.SPYMASTER ? GameView.PLAYER : GameView.SPYMASTER;
  }

  public isSpyMasterViewOn() {
    return this.gameView === GameView.SPYMASTER;
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

}
