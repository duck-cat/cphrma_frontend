import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, CustomChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from '../echart-data.service';

echarts.use([BarChart, CustomChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

interface ChartSeries {
  name: string;
  data: number[];
}

@Component({
  selector: 'app-stackedbarcharttype-2',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './stackedbarcharttype-2.component.html',
  styleUrl: './stackedbarcharttype-2.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class Stackedbarcharttype2Component implements OnChanges {
  @Input() data: any[] = [];
  @Input() column: any[] = [];

  private readonly sampleCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  private readonly sampleSeries: ChartSeries[] = [
    { name: 'Direct', data: [100, 302, 301, 334, 390, 330, 320] },
    { name: 'Mail Ad', data: [320, 132, 101, 134, 90, 230, 210] },
    { name: 'Affiliate Ad', data: [220, 182, 191, 234, 290, 330, 310] },
    { name: 'Video Ad', data: [150, 212, 201, 154, 190, 330, 410] },
    { name: 'Search Engine', data: [820, 832, 901, 934, 1290, 1330, 1320] }
  ];
  private readonly colors = ['#5070dd', '#b6d634', '#505372', '#ff994d', '#0ca8df'];

  chartOption: any = {};

  constructor(private readonly echartService: EchartDataService) {
    this.renderChart(this.sampleCategories, this.sampleSeries, this.colors);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['column'] && !changes['data']) {
      return;
    }

    if (!this.column.length && !this.data.length) {
      return;
    }

    if (!this.column.length || !this.data.length) {
      this.renderChart([], [], this.colors);
      return;
    }

    const chartData = this.echartService.getDataSetFor_eCharts(this.column, this.data, 'multi');
    const categories = chartData?.xAxis?.data?.[0]?.data ?? [];
    const series: ChartSeries[] = (chartData?.series ?? [])
      .filter((series: any) => Array.isArray(series?.data))
      .map((series: any) => ({
        name: series.name,
        data: series.data.map((value: unknown) => this.toNonNegativeNumber(value))
      }));

    this.renderChart(categories, series, chartData?.color?.length ? chartData.color : this.colors);
  }

  private toNonNegativeNumber(value: unknown): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
  }

  private renderChart(categories: string[], series: ChartSeries[], colors: string[]): void {
    const categoryCount = categories.length;
    const validSeries = series.filter(item => item.data.length === categoryCount);
    const totals = categories.map((_, categoryIndex) =>
      validSeries.reduce((sum, item) => sum + this.toNonNegativeNumber(item.data[categoryIndex]), 0)
    );
    const normalizedSeries = validSeries.map(item => ({
      ...item,
      data: item.data.map((value, categoryIndex) =>
        totals[categoryIndex] > 0 ? this.toNonNegativeNumber(value) / totals[categoryIndex] : 0
      )
    }));

    const connectorSeries = categoryCount > 1 && normalizedSeries.length
      ? [{
          name: '__stack-connectors',
          type: 'custom',
          coordinateSystem: 'cartesian2d',
          data: categories.slice(1).map((_, index) => index + 1),
          silent: true,
          tooltip: { show: false },
          legendHoverLink: false,
          z: 0,
          renderItem: (params: any, api: any) => {
            const currentCategory = params.dataIndex + 1;
            const previousCategory = currentCategory - 1;
            const previousCenter = api.coord([previousCategory, 0])[0];
            const currentCenter = api.coord([currentCategory, 0])[0];
            const categoryWidth = currentCenter - previousCenter;
            const barHalfWidth = categoryWidth * 0.3;
            const leftX = previousCenter + barHalfWidth;
            const rightX = currentCenter - barHalfWidth;
            let previousBase = 0;
            let currentBase = 0;
            const children: any[] = [];

            normalizedSeries.forEach((item, seriesIndex) => {
              const previousTop = previousBase + item.data[previousCategory];
              const currentTop = currentBase + item.data[currentCategory];
              children.push({
                type: 'polygon',
                shape: {
                  points: [
                    api.coord([previousCategory, previousBase]).map((value: number, index: number) => index === 0 ? leftX : value),
                    api.coord([previousCategory, previousTop]).map((value: number, index: number) => index === 0 ? leftX : value),
                    api.coord([currentCategory, currentTop]).map((value: number, index: number) => index === 0 ? rightX : value),
                    api.coord([currentCategory, currentBase]).map((value: number, index: number) => index === 0 ? rightX : value)
                  ]
                },
                style: {
                  fill: colors[seriesIndex % colors.length],
                  opacity: 0.25
                }
              });
              previousBase = previousTop;
              currentBase = currentTop;
            });

            return { type: 'group', children };
          }
        }]
      : [];

    this.chartOption = {
      animation: false,
      color: colors,
      grid: { top:10, left: 10, right: 10, bottom: 30, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (items: any[]) => {
          const category = items?.find((item: any) => item.seriesType === 'bar')?.axisValue ?? '';
          const lines = items
            .filter((item: any) => item.seriesType === 'bar')
            .map((item: any) => `${item.marker}${item.seriesName}: ${(Number(item.value) * 100).toFixed(1)}%`);
          return [category, ...lines].join('<br>');
        }
      },
      legend: {
        data: validSeries.map(item => item.name),
        selectedMode: false,
        bottom: 8,
        left: 'center',
        itemWidth: 18,
        itemHeight: 12,
        itemGap: 14,
        icon: 'roundRect',
        textStyle: { fontSize: 12, color: '#555' }
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisTick: { alignWithLabel: true },
        axisLine: { lineStyle: { color: '#777' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1,
        interval: 0.2,
        axisLabel: {
          color: '#666',
          formatter: (value: number) => Number(value.toFixed(1)).toString()
        },
        splitLine: { lineStyle: { color: '#dce1e8' } }
      },
      series: [
        ...connectorSeries,
        ...normalizedSeries.map((item, index) => ({
          name: item.name,
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          z: 2,
          label: {
            show: true,
            position: 'inside',
            color: ['#fff', '#30354a', '#fff', '#30354a', '#16425a'][index % 5],
            fontSize: 12,
            formatter: (params: any) => {
              const value = Number(params.value);
              return value > 0 ? `${(value * 100).toFixed(1)}%` : '';
            }
          },
          itemStyle: { color: colors[index % colors.length] },
          data: item.data
        }))
      ]
    };
  }
}
