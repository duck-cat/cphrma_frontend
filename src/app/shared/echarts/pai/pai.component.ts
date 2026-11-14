import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from '../echart-data.service';

echarts.use([PieChart, LegendComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-pai',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './pai.component.html',
  styleUrl: './pai.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class PaiComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() column: any[] = [];
  chartType="pai";
  constructor(private echartService: EchartDataService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.length > 0 && this.column.length > 0) {
      const chartData = this.echartService.getDataSetFor_eCharts(this.column, this.data, 'single');
      this.reRenderChart(chartData);
    }
  }

  private reRenderChart(data: any): void {
 //   if (!data?.series?.[0]?.data) {
  //    return;
  //  }

    this.chartOption.color = data.color?.length ? data.color : this.chartOption.color;
    this.chartOption.tooltip = {
      ...data.tooltip,
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    };
    this.chartOption.legend = {
      ...data.legend,
      show: data.legend?.show ?? true,
      bottom: 0,
      left: 'center'
    };
    this.chartOption.series[0].data = data.series[0].data;
    this.chartOption = { ...this.chartOption };
  }

  chartOption: any = {
    color: ['#4F46E5', '#06B6D4', '#F59E0B', '#EF4444', '#8B5CF6'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 0,
      left: 'center'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        roseType: false,
        itemStyle: {
          borderRadius: 3,
          borderColor: '#ffffff',
          borderWidth: 1
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 10,
          show: true,
         // formatter: '{d}%',
           distance: 1,
           position: 'outside',
         //  fontSize:8,
            fontWeight: 'bold',
            fontFamily: 'Arial'

        },
        labelLine: {
          length: 10,
          length2: 8
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
          }
        },
        data: []
      }
    ]
  };

}
