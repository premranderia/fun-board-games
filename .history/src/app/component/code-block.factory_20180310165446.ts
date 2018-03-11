import { CodeBlockColor } from './code-block.constant';

export class CodeBlock {
  public word: string;
  public color: string;
  public id: number;

  constructor({ word, color, id }) {
    this.id = id;
    this.word = word || 'TEST';
    this.color = color || CodeBlockColor.YELLOW;
  }
}