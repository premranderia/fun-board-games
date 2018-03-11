import { Component, Input } from '@angular/core';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component.html`,
  styles: ['./code-name.component.css']
})
export class CodeNameComponent  {
  @Input() name: string;
}
