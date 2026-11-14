import { Component, OnChanges, SimpleChanges,Input } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {EchartDataService} from "../echart-data.service";
echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-horizontal-bar-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrl: './horizontal-bar-chart.component.scss',
  providers:[provideEchartsCore({ echarts }),EchartDataService]
})
export class HorizontalBarChartComponent {
constructor(private echartService:EchartDataService){

  }
  @Input() data: any[] = [];
  @Input() column: any[] = [];
  finalData: any = {};
   chartType="bar";
   labelStyle={label: {
    show: true,
    position: 'right',
    formatter:  (params: any) => {
    const value = params.value;

    return value === 0 || value === '' || value == null
      ? ''
      : value;
  },
    fontSize: 10,
    fontWeight: 'bold',
    distance: 8,
    z:1000,
   
  }};
  ngOnChanges(changes: SimpleChanges): void {
     if (this.data.length > 0 && this.column.length > 0) {
      this.finalData = this.echartService.getDataSetFor_eCharts(this.column, this.data, "multi");
      //  this.legend = this.finalData.legend;
      // this.renderChart();
      this.reRenderChart();
    }
  }

  reRenderChart(){
      this.chartOption['yAxis']["data"]=this.finalData.xAxis.data[0].data;
      this.chartOption['xAxis']=this.finalData["yAxis"];
      this.chartOption["series"]=this.finalData.series.map((res:any)=>{return {type:'bar',...res,...this.labelStyle}});
      this.chartOption["grid"]={...this.chartOption["grid"],...this.finalData["grid"]};
      this.chartOption["grid"].bottom=this.finalData.series.length>5?50:20;
       this.chartOption["color"]=this.finalData["color"];
       this.chartOption["legend"]={...this.chartOption["legend"],... this.finalData["legend"]};
      this.chartOption={...this.chartOption};
  }
  chartOption: any = {
    color:[],
    animation: true,
    animationDuration: 1000,  
    grid: {
      top: 10,
      left: 5,
      right: 30,
      bottom: 10,
      containLabel: true
    },
    legend: {
      show: true,
      bottom: 0,
      right: 10,
      icon: 'roundRect',

      itemWidth: 14,
      itemHeight: 10,
      itemGap: 20,

      textStyle: {
        fontSize: 12,
        color: '#555'
      }
    },
    tooltip: { trigger: 'axis',axisPointer: { type: 'shadow' } },
    xAxis: { },
    yAxis: {data:[]},
    series: [
      
    ]
  };
}
