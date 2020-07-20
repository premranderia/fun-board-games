import { OnInit, Component } from "@angular/core";
import { Route, Router } from "@angular/router";
import { ROUTES } from "../routes/route.constant";

@Component({
  selector: "index-component",
  templateUrl: "./index-component.html",
  styleUrls: [
    "./index-component.css",
    "../app.css",
    "../home-component/home-component.css",
  ],
})
export class IndexComponent implements OnInit {
  ROUTES = ROUTES;
  constructor(private router: Router) {}

  ngOnInit() {}

  public navigate(route): void {
    this.router.navigate([`/${route}`], {});
  }
}
