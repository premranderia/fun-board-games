import { CodeBlockColor } from './code-block.constant';

export class CodeBlock {
  public word: string;
  public color: CodeBlockColor;
  public currentColor: CodeBlockColor;
  public id: number;
  public clicked: boolean;

  constructor({ word, color, id, clicked = false }) {
    this.id = id;
    this.word = word;
    this.color = color;
    this.currentColor = CodeBlockColor.NONE;
    this.clicked = clicked;
  }
}
