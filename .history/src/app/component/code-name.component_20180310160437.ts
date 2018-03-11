import { Component, Input } from '@angular/core';
import { CodeBlock } from './code-block.factory';
import { CodeBlockColor } from './code-block.constant';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styles: ['./code-name.component.css']
})
export class CodeNameComponent {
  public rows: number;
  public columns: number;
  public codeBlocks: Array<CodeBlock>;
  private maxColor = 9;
  private minColor = 8;

  constructor() {
    this.rows = 5;
    this.columns = 5;
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
    const totalBlocks = this.rows * this.columns;
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
