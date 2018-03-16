
import { CodeBlock } from '../code-block.factory';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CodeBlockService {
  private headers: HttpHeaders;
  private server = '/api';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  storeGame({ id, blocks, spyViewCount }: { id: Number, blocks: CodeBlock[], spyViewCount: number }) {
    return this.http.post(`${this.server}/code-name`, {
      id,
      data: { blocks, spyViewCount }
    }, {
        headers: this.headers
      });
  }

  getGame({ id }) {
    return this.http.get(`${this.server}/code-name/${id}`);
  }

}