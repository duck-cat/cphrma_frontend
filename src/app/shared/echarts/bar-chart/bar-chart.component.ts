import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from "../echart-data.service";
echarts.use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-bar-echart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class BarChartComponent implements OnChanges {
  constructor(private echartService: EchartDataService) {

  }
  @Input() data: any[] = [];
  @Input() column: any[] = [];
  chartType="bar";
  finalData: any = {};
  chartInstance!: any;
  markSection={
     splitArea: {
   /* show: true,
    areaStyle: {
      color: [
        'rgba(58, 123, 228, 0.08)',
       'rgba(255, 255, 255, 0.02)'
      ]
    }*/
  },
    splitLine: {
    show: true,
    lineStyle: {
      type: 'dotted',
      color: '#94A3B8',
      width: 1
    }
  }
};
  labelStyle = {
    label: {
      show: true,
      position: 'top',
      formatter: (params: any) => {
        const value = params.value;

        return value === 0 || value === '' || value == null
          ? ''
          : value;
      },
      fontSize: 10,
      fontWeight: 'bold',
      distance: 8,
      z: 1000,

    }
  };
  ngOnChanges(changes: SimpleChanges): void {
    this.chartInstance?.clear();
    if (this.data.length > 0 && this.column.length > 0) {
      this.finalData = this.echartService.getDataSetFor_eCharts(this.column, this.data, "multi");
      this.finalData.series=this.finalData.series.filter((res: any) => {
        let hasDataArray = res.data.filter((val: any) => val != undefined);
        return hasDataArray.length > 0 ? true : false;
      });
      //  this.legend = this.finalData.legend;
      // this.renderChart();
      this.reRenderChart();
    }
  }
  onChartInit(chartInstance: any) {
    this.chartInstance = chartInstance;
  }
  
  reRenderChart() {
    this.chartOption['xAxis']["data"] = this.finalData.xAxis.data[0].data;
    this.chartOption['yAxis'] = this.finalData["yAxis"];
    this.chartOption["series"] = this.finalData.series.map((res: any) => { return { type: 'bar', ...res, ...this.labelStyle } });

    this.chartOption["grid"] = { ...this.chartOption["grid"], ...this.finalData["grid"] };
    this.chartOption["grid"].bottom = this.finalData.series.length > 5 ? 50 : 20;
    this.chartOption["color"] = this.finalData["color"];
    this.chartOption["legend"] = { ...this.chartOption["legend"], ... this.finalData["legend"]};
   //  this.chartOption.xAxis.splitArea=this.markSection.splitArea;
   // this.chartOption.xAxis.splitLine=this.markSection.splitLine;
    this.chartOption=this.echartService.finalPropImplement(this.chartOption,(this.finalData?.['wms_properties']||{}));
    this.chartOption = { ...this.chartOption };
  }
  chartOption: any = {
    color: [],
    animation: true,
    animationDuration: 1000,
    legend: {
      type: 'scroll',
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
    grid: {
      top: 20,
      left: 5,
      right: 3,
      bottom: 30,
      containLabel: true
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, z: 9999 },
    xAxis: { data: [],  
      axisLabel: {
      show: true,
      fontSize: 12,
      color: '#333'
    },splitArea:{},splitLine:{} },
    yAxis: {
      axisLabel: {
    show: true,
    interval: 0,       // Display every label
    hideOverlap: false,
    fontSize: 10
  }
    },
    
    series: [

    ]
  };

}
