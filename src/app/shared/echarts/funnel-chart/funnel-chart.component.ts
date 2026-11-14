import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { FunnelChart } from 'echarts/charts';
import { LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from '../echart-data.service';

echarts.use([FunnelChart, LegendComponent, ToolboxComponent, TooltipComponent, CanvasRenderer]);

interface FunnelDatum {
  name: string;
  value: number;
}

@Component({
  selector: 'app-funnel-chart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './funnel-chart.component.html',
  styleUrl: './funnel-chart.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class FunnelChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() column: any[] = [];

  private readonly sampleData: FunnelDatum[] = [
    { value: 60, name: 'Visit' },
    { value: 40, name: 'Inquiry' },
    { value: 20, name: 'Order' },
    { value: 80, name: 'Click' },
    { value: 100, name: 'Show' }
  ];

  chartOption: any = {};

  constructor(private readonly echartService: EchartDataService) {
    this.renderChart(this.sampleData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['column'] && !changes['data']) {
      return;
    }

    if (!this.column.length && !this.data.length) {
      return;
    }

    if (!this.data.length) {
      this.renderChart([]);
      return;
    }

    const funnelData = this.getFunnelData();
    this.renderChart(funnelData);
  }

  private getFunnelData(): FunnelDatum[] {
    if (this.data.every((item: any) => item && typeof item.name === 'string' && item.value !== undefined)) {
      return this.data.map((item: any) => ({
        name: item.name,
        value: this.toNonNegativeNumber(item.value)
      }));
    }

    if (!this.column.length) {
      return [];
    }

    const chartData = this.echartService.getDataSetFor_eCharts(this.column, this.data, 'multi');
    const categories: string[] = chartData?.xAxis?.data?.[0]?.data ?? [];
    const values: unknown[] = chartData?.series?.[0]?.data ?? [];

    return categories.map((name, index) => ({
      name,
      value: this.toNonNegativeNumber(values[index])
    }));
  }

  private toNonNegativeNumber(value: unknown): number {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
  }

  private renderChart(data: FunnelDatum[]): void {
    const names = data.map(item => item.name);
    this.chartOption = {
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'],
      title: {
        text: 'Funnel',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 600, color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      toolbox: {
        right: 12,
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {}
        }
      },
      legend: {
        data: names,
        left: 'center',
        bottom: 4,
        type: 'scroll',
        textStyle: { color: '#555', fontSize: 12 }
      },
      series: [{
        name: 'Funnel',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 48,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}%'
        },
        labelLine: {
          length: 10,
          lineStyle: { width: 1, type: 'solid' }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: { fontSize: 20 }
        },
        data
      }]
    };
  }
}
