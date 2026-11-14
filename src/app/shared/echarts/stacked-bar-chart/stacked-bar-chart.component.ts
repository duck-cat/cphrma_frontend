import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from '../echart-data.service';

echarts.use([BarChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-stacked-bar-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './stacked-bar-chart.component.html',
  styleUrl: './stacked-bar-chart.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class StackedBarChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() column: any[] = [];
   chartType="bar";
labelStyle = {
    label: {
      show: true,
      position: 'inside',
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
  constructor(private echartService: EchartDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.column.length > 0) {
      const chartData = this.echartService.getDataSetFor_eCharts(this.column, this.data, 'multi');
      //this.chartOption["series"] = this.chartOption.series.map((res: any) => { return {  ...this.labelStyle } });
      this.reRenderChart(chartData);
    }
  }

  private reRenderChart(data: any): void {
    const categoryData = data?.xAxis?.data?.[0]?.data;

   // if (!categoryData || !data?.series?.length) {
   //   return;
   // }

    this.chartOption.color = data.color?.length ? data.color : this.chartOption.color;
    this.chartOption.tooltip = {
      ...data.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    };
    this.chartOption.legend = {
      ...data.legend,
      bottom: 30,
      left: 'center',
      textStyle: {
        fontSize: 10
      },
      itemWidth: 10,
      itemHeight: 8,
      itemGap: 12
    };
    this.chartOption.grid = {
      ...this.chartOption.grid,
      ...data.grid,
      bottom: 48,
      containLabel: true
    };
    this.chartOption.xAxis = {
      type: 'category',
      data: categoryData
    };
    this.chartOption.yAxis = data.yAxis;
    this.chartOption.series = data.series.map((series: any) => ({
      ...series,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      ...this.labelStyle 
    }));
   // delete this.chartOption["wms_properties"];
    this.chartOption = { ...this.chartOption };
  }
  
  chartOption: any = {
    color: ['#4F46E5', '#06B6D4', '#F59E0B'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      bottom: 0
    },
    grid: {
      top: 24,
      left: 12,
      right: 12,
      bottom: 48,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [] as any[]
    },
    yAxis: {
      type: 'value',
      name: '',
    },
    series: [] as any[]
  };

}
