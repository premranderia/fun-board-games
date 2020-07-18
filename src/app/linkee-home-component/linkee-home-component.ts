import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryParams } from '../home-component/home-component';
import { ROUTES } from '../routes/route.constant';
import * as _ from 'lodash';

@Component({
  selector: 'linkee-home-component',
  templateUrl: './linkee-home-component.html',
  styleUrls: ['./linkee-home-component.css', '../app.css']
})

export class LinkeeHomeComponent implements OnInit {
  public gameId: number;
  public spyMode: boolean;
  public players;
  public _ = _;
  public playerNames;
  public value;
  private score = {
    L: 0,
    I: 0,
    N: 0,
    K: 0,
    E: 0,
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.players = [{
      name: 'test'
    }];
    this.playerNames = [];
  }
  public enterGameWithId(): void {
    let queryParams: QueryParams = {};
    if (this.gameId > 0) {
      queryParams.id = this.gameId;
    }
    this.navigate(queryParams);
  }

  public navigate(queryParams): void {
    this.router.navigate([`/${ROUTES.LINKEE_GAME}`], {
      queryParams
    });
  }

  public remove(name): void {
    const index = this.playerNames.indexOf(name);

    if (index >= 0) {
      this.playerNames.splice(index, 1);
    }
  }

  add(event): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.playerNames.push({ name: value.trim(), score: this.score });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}