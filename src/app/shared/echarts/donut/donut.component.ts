import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from "../echart-data.service";
echarts.use([PieChart, LegendComponent, TitleComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-donut',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './donut.component.html',
  styleUrl: './donut.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class DonutComponent implements OnInit, OnChanges {
  constructor(private echartService: EchartDataService) { }
  @Input() data: any[] = [];
  @Input() column: any[] = [];
  finalData: any = {};
   chartType="donut";
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.data.length > 0 && this.column.length > 0) {
      this.finalData = this.echartService.getDataSetFor_eCharts(this.column, this.data, "single");
      //  this.legend = this.finalData.legend;
      // this.renderChart();
      this.reRenderChart();
    }
  }

  reRenderChart() {
    let data = this.finalData;
    const { left, right, top, bottom, orient, ...legendOptions } = data["legend"] || {};

    this.chartOption["color"] = data["color"];
    this.chartOption["tooltip"] = {
      ...data["tooltip"],
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    };
    this.chartOption["legend"] = {
      ...legendOptions,
      //show: true,
      orient: 'horizontal',
      right: 1,

      top: 'bottom',
      //fontSize: 8,
      textStyle: {
        fontSize: 12
      },
      itemWidth: 12,
      itemHeight: 10,
      itemGap: 12,
     
    };
    this.chartOption["title"] = {
      ...this.chartOption["title"],
      text: data["chartTitle"] || data["name"] || ''
    };
    this.chartOption["series"][0].data = data["series"][0].data;
    this.chartOption = this.echartService.finalPropImplement(this.chartOption, (this.finalData?.['wms_properties'] || {}),this.chartType);
    //this.chartOption["series"][0].name = data["name"];
    this.chartOption = { ...this.chartOption };
  }

  chartOption: any = {
    animation: true,
    animationDuration: 1500,
    // animationEasing: 'cubicOut',
    color: ['#4F46E5', '#06B6D4', '#F59E0B', '#EF4444'],
    title: {
      text: '',
      left: 'center',
      top: 8,
      textStyle: {
        fontSize: 14,
        fontWeight: 600,
        overflow: 'truncate',
        width: 220
      },
      show: false
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      show: true,
      orient: 'vertical',
      right: 8,
      top: 'top'
    },
    series: [
      {
        // name: 'Transaction Status',
        type: 'pie',
        radius: ['37%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 2,
          borderColor: '#ffffff',
          borderWidth: 3
        },
        label: {
          show: true,
          formatter: (params: any) => {
    return params.percent === 0 ? '' : `${params.percent}%`;
  },
          distance: 1,
          position: 'outside',
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily: 'Arial',
          bottom: 0,
          alignTo: 'edge',
          edgeDistance: '5%',
        },
        labelLine: {
          show: true,
          length: 20,
          length2: 20
        },
        labelLayout: {
          hideOverlap: false,
          moveOverlap: 'shiftY'
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [

        ]
      },
    ]
  };

}
