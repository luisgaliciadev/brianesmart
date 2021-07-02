import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit {

  constructor(
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    init_plugins();
    this.spinner.hide();
  }

}
