import { Component, Input } from '@angular/core';
import { CodeBlock } from './code-block.factory';
import { CodeBlockColor } from './code-block.constant';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styleUrls: ['./code-name.component.css']
})
export class CodeNameComponent {
  public rows: Array<any>;
  public columns: Array<any>;
  public codeBlocks: Array<CodeBlock>;
  private maxColor = 9;
  private minColor = 8;
  private noOfRows = 5;
  private noOfColumns = 5;

  constructor() {
    this.rows = new Array(this.noOfRows);
    this.columns = new Array(this.noOfColumns);
    this.codeBlocks = [];
  }

  public getBlock(id): CodeBlock {
    const block = new CodeBlock({
      color: '',
      word: '',
      id
    });
    return block;
  }

  public initGame() {
    const totalBlocks = this.noOfColumns * this.noOfRows;
    let i = 0;
    while (i < totalBlocks) {
      this.codeBlocks.push(this.getBlock(i));
      i++;
    }
  }

  private getRandomColor(): string {
    return CodeBlockColor.BLUE;
  }

}
