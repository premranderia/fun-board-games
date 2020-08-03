import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { LinkeeGameData, Cards } from '../../linkee/linkee-game.component';

@Injectable()
export class LinkeeGameService {
  private headers: HttpHeaders;
  private server = `${environment.serverUrl}/api`;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders();
    this.headers.append('Content-Type', 'application/json');
  }

  public storeGame(linkeGameData: LinkeeGameData): Observable<any> {
    return this.http.post(
      `${this.server}/linkee-game`,
      {
        id: linkeGameData.id,
        data: linkeGameData,
      },
      {
        headers: this.headers,
      }
    );
  }

  public getGame({ id }): Promise<LinkeeGameData> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.server}/linkee-game/${id}`)
        .toPromise()
        .then(
        (data: LinkeeGameData) => {
          resolve(data);
        },
        () => {
          reject();
        }
        );
    });
  }

  public getQuestions(): Promise<Cards[]> {
    return new Promise((resolve, reject) => {
      this.http
        .get(`${this.server}/linkeegame/questions`)
        .toPromise()
        .then(
        (data: Cards[]) => {
          resolve(data);
        },
        () => {
          reject();
        }
        );
    });
  }
}
