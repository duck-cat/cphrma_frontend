import { Component, OnInit } from '@angular/core';
//import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import {menuItems} from "../home-page/home-page.config";
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [CardModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent  implements OnInit{
 menus:any[]=[];
 ngOnInit(): void {
    this.menus=menuItems.filter(res=>res.key!="settings");
 }
}
