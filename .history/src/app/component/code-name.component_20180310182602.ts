import { Component, Input } from '@angular/core';
import { CodeBlock } from './code-block.factory';
import { CodeBlockColor } from './code-block.constant';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styleUrls: ['./code-name.component.css']
})
export class CodeNameComponent {
  public rows: Array<any>;
  public columns: Array<any>;
  public codeBlocks: Array<CodeBlock>;
  public colors: Array<CodeBlockColor>;
  public words: Array<string>;
  private maxColor = 9;
  private minColor = 8;
  private noOfRows = 5;
  private noOfColumns = 5;
  private totalBlocks = this.noOfColumns * this.noOfRows;

  constructor() {
    this.codeBlocks = [];
    this.shuffleColors();
    this.shuffleWords();
    this.initGame();
  }

  public getBlock(id): CodeBlock {
    const block = new CodeBlock({
      color: this.colors[id],
      word: this.words[id],
      id
    });
    return block;
  }

  public initGame() {
    let i = 0;
    while (i < this.totalBlocks) {
      this.codeBlocks.push(this.getBlock(i));
      i++;
    }
  }

  public shuffleArray() {
    this.codeBlocks.length = 0;
    this.colors = _.shuffle(this.colors);
    this.shuffleWords();
    this.initGame();
  }

  private shuffleColors(): Array<CodeBlockColor> {
    const arr = [];

    arr.push(CodeBlockColor.BLACK);

    while (this.maxColor > 0) {
      arr.push(CodeBlockColor.RED);
      this.maxColor--;
    }

    while (this.minColor > 0) {
      arr.push(CodeBlockColor.BLUE);
      this.minColor--;
    }

    let arrLength = arr.length;
    while (arrLength < this.totalBlocks) {
      arr.push(CodeBlockColor.YELLOW);
      arrLength++;
    }
    return _.shuffle(arr);
  }

  private shuffleWords() {
    this.words = _.sampleSize(DATA, this.totalBlocks);
  }

}
