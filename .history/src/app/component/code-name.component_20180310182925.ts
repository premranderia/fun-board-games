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
    this.reset();
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

  private shuffleColors() {
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
    this.colors = _.shuffle(arr);
  }

  private shuffleWords() {
    this.words = _.sampleSize(DATA, this.totalBlocks);
  }

}
