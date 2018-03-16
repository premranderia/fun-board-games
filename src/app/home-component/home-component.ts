import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';
import * as _ from 'lodash';
import { DATA } from '../../assets/game-sample';
import 'rxjs/add/operator/map';
import { NgIf } from '@angular/common';

@Component({
  selector: 'home-component',
  templateUrl: './home-component.html',
  styleUrls: ['./home-component.css', '../app.css']
})

export class HomeComponent implements OnInit {
  public gameId: number;
  constructor(private router: Router) { }
  ngOnInit() {
    this.gameId = 0;
  }
  public enterGameWithId() {
    let queryParams = {};
    if (this.gameId > 0) {
      queryParams['id'] = this.gameId;
    }
    this.navigate(queryParams);
  }
  public navigate(queryParams) {
    this.router.navigate(['/game'], {
      queryParams
    });
  }
}