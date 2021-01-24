import { Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  danceForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z]+$/)])
  })

  name = undefined;

  getDanceVideo() {
    this.name = this.danceForm.value.name;
  }
}
