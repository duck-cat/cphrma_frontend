import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DonutComponent } from "../donut/donut.component";
import {CommonModule} from "@angular/common";
import { EchartDataService } from "../echart-data.service";
import { BarChartComponent } from "../bar-chart/bar-chart.component";
import { HorizontalBarChartComponent } from "../horizontal-bar-chart/horizontal-bar-chart.component";
import { PaiComponent } from '../pai/pai.component';
import { StackedBarChartComponent } from '../stacked-bar-chart/stacked-bar-chart.component';
import { Stackedbarcharttype2Component } from '../stackedbarcharttype-2/stackedbarcharttype-2.component';
import { FunnelChartComponent } from '../funnel-chart/funnel-chart.component';
import { LineEchartComponent } from '../line-echart/line-echart.component';
import { HeatMapEchartComponent } from "../heat-map-echart/heat-map-echart.component";
@Component({
  selector: 'app-common-echart',
  standalone: true,
  imports: [CommonModule,HeatMapEchartComponent, BarChartComponent, DonutComponent, HorizontalBarChartComponent, PaiComponent, StackedBarChartComponent, Stackedbarcharttype2Component, FunnelChartComponent, LineEchartComponent],
  templateUrl: './common-echart.component.html',
  styleUrl: './common-echart.component.scss',
  providers: [EchartDataService]
})
export class CommonEchartComponent implements OnChanges {
  constructor() {

  }
  @Input() column = [];
  @Input() data:any = [];
  @Input() tab = "";
  @Input() type = "";
  @Input() callback!: any;
  @Input() interval: any;
  @Output("editEvent") editEvent = new EventEmitter();
  @Input() beforeColumnSetCallBack: any;
  @Input() beforeDataSetCallBack: (data:any)=>any=(data)=>data;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("column") ) {
      this.data = [];
    }
    if (changes.hasOwnProperty("data")) {
      let dataSet = [];
      if(this.data.length==1 && this.data[0]?.hasOwnProperty("error")){
         this.data = [];
         return;
        }
      if (this.beforeDataSetCallBack && typeof this.beforeDataSetCallBack == "function") {
        dataSet = this.beforeDataSetCallBack(this.data);
        this.data = dataSet;
      } else {
        
           this.data = [...this.data];
        
      }

    }
    if (this.tab) {

      let columnSet = [...this.column.filter((res) => { return res["shm_tab"] == this.tab })];
      if (this.beforeColumnSetCallBack && typeof this.beforeColumnSetCallBack == "function") {
        columnSet = this.beforeDataSetCallBack(columnSet);
      }
      this.column = columnSet;
    }


    this.type = this.column.filter((res) => { return res["shm_lookup"] == "" })[0]?.["shm_type"];
    //this.type=this.column.filter((res)=>{return res["shm_tab"]=="transaction_history_hourly"}).length>0?"heat-map":this.type;

  }
}
