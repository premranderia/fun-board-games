import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../routes/route.constant';
import * as _ from 'lodash';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

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
  public value;
  public separatorKeysCodes = [ENTER, COMMA];
  public selectable: boolean = true;
  public removable: boolean = true;
  public addOnBlur: boolean = true;
  private score = {
    L: 0,
    I: 0,
    N: 0,
    K: 0,
    E: 0,
  };

  constructor(private router: Router) { }

  ngOnInit() {
    this.players = [];
    this.spyMode = false;
  }

  public enterGameWithId(): void {
    let queryParams: QueryParams = {};
    if (this.gameId > 0) {
      queryParams.id = this.gameId;
    }
    if (this.spyMode) {
      queryParams.spy = this.spyMode;
    }
    if (this.players) {
      queryParams.players = JSON.stringify(this.players);
    }
    this.navigate(queryParams);
  }

  public navigate(queryParams): void {
    this.router.navigate([`/${ROUTES.LINKEE_GAME}`], {
      queryParams
    });
  }

  public remove(name): void {
    name = name.toUpperCase();
    const index = this.players.indexOf(name);
    if (index >= 0) {
      this.players.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.players.push({ name: value.trim().toUpperCase(), score: this.score });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}

export interface QueryParams {
  id?: number;
  players?: string;
  spy?: boolean;
}
export interface Players {
  name: string;
  score: Score;
}

interface Score {
  L: number;
  I: number;
  N: number;
  K: number;
  E: number;
}