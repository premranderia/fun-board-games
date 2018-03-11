import { CodeBlockColor } from './code-block.constant';

export class CodeBlock {
  public word: string;
  public color: CodeBlockColor;
  public currentColor: CodeBlockColor;
  public id: number;

  constructor({ word, color, id }) {
    this.id = id;
    this.word = word;
    this.color = color;
    this.currentColor = CodeBlockColor.YELLOW;
  }
}