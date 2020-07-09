import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryParams } from '../home-component/home-component';
import { ROUTES } from '../routes/route.constant';

@Component({
  selector: 'linkee-home-component',
  templateUrl: './linkee-home-component.html',
  styleUrls: ['./linkee-home-component.css', '../app.css']
})

export class LinkeeHomeComponent implements OnInit {
  public gameId: number;

  constructor(private router: Router) { }

  ngOnInit() {

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
}