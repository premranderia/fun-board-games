import { Component, Input } from '@angular/core';

@Component({
  selector: 'code-name',
  templateUrl: `./code-name.component`,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent  {
  @Input() name: string;
}
