import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from '../echart-data.service';

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-line-echart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './line-echart.component.html',
  styleUrl: './line-echart.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class LineEchartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() column: any[] = [];
   chartType="line";
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
  constructor(private echartService: EchartDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.column.length > 0) {
      const chartData = this.echartService.getDataSetFor_eCharts(this.column, this.data, 'multi');
      chartData.series = chartData.series.filter((res: any) => {
        let hasDataArray = res.data.filter((val: any) => val != undefined);
        return hasDataArray.length > 0 ? true : false;
      });
      this.chartOption["grid"].bottom = chartData.series.length > 5 ? 80 : 20;
      this.reRenderChart(chartData);
    }
  }

  private reRenderChart(data: any): void {
    const categoryData = data?.xAxis?.data?.[0]?.data;

    //  if (!categoryData || !data?.series?.length) {
    //   return;
    //  }

    this.chartOption.color = data.color?.length ? data.color : this.chartOption.color;
    this.chartOption.tooltip = {
      ...data.tooltip,
      trigger: 'axis'
    };
    this.chartOption.legend = {
      ...data.legend,
      bottom: 0,
      left: 'center'
    };
    this.chartOption.grid = {

      ...this.chartOption.grid,
      ...data.grid,
      containLabel: true
    };
    this.chartOption.xAxis = {
      type: 'category',
      boundaryGap: true,
      data: categoryData
    };
    this.chartOption.yAxis = {...data.yAxis,  axisLabel: {
        show: true,
        interval: 0,       // Display every label
        hideOverlap: false,
        fontSize: 10
      }};
    this.chartOption.series = data.series.map((series: any) => ({
      ...series,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 7,
      lineStyle: { width: 3 },
      ...this.labelStyle
    }));
    this.chartOption = { ...this.chartOption };
  }

  chartOption: any = {
    color: ['#4F46E5', '#06B6D4', '#F59E0B'],
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: true,
      bottom: 0,
      right: 0,
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
      top: 25,
      left: 5,
      right: 3,
      bottom: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: [] as any[]
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        show: true,
        interval: 0,       // Display every label
        hideOverlap: false,
        fontSize: 10
      },
      splitLine: {
        lineStyle: { color: '#E5E7EB' }
      }
    },
    series: [] as any[]
  };

}
