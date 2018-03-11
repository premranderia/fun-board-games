import { Component, Input } from '@angular/core';
import { CodeBlock } from './code-block.factory';
import { CodeBlockColor } from './code-block.constant';
import { NgForOf } from '@angular/common';
import _ from 'lodash';

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
  private maxColor = 9;
  private minColor = 8;
  private noOfRows = 5;
  private noOfColumns = 5;
  private totalBlocks = this.noOfColumns * this.noOfRows;

  constructor() {
    this.codeBlocks = [];
    this.colors = this.generateRandomColor();
    this.initGame();
  }

  public getBlock(id): CodeBlock {
    const block = new CodeBlock({
      color: this.colors[id],
      word: undefined,
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

  private generateRandomColor(): Array<CodeBlockColor> {
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
    return arr;
  }

}
