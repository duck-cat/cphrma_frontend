import { Component } from '@angular/core';
import {CommonTableComponent} from "../../components/common-table/common-table.component";
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonTableComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

}
