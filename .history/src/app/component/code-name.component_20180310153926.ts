import { Component, Input } from '@angular/core';
import { CodeBlock } from './code-block.factory';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styles: ['./code-name.component.css']
})
export class CodeNameComponent {
  public rows: number;
  public columns: number;
  public codeBlocks: Array<CodeBlock>;

  constructor() {
    this.rows = 5;
    this.columns = 5;
  }

  public randomColor() {

  }

  public initBox() {
    let totalBlocks = this.rows * this.columns;
    while (totalBlocks > 0) {

      totalBlocks--;
    }
  }
}
