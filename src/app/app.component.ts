import { Component } from '@angular/core';

// Servicios
import { SettingsService } from './services/service.index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Briane Smart';

  constructor( public _ajustes: SettingsService) {

  }

}
