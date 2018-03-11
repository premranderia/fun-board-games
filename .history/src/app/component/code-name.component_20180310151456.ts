import { Component, Input } from '@angular/core';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styles: ['./code-name.component.css']
})
export class CodeNameComponent  {
  @Input() name: string;
  public rows: Number;
  public columns: Number;

  constructor() {
    this.rows = 5;
    this.columns = 5;
  }

  public initBox() {

  }
}
