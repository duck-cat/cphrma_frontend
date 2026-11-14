import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EchartDataService } from "../echart-data.service";
import { ECharts, EChartsType ,EChartsOption} from "echarts";

echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

@Component({
  selector: 'app-heat-map-echart',
  standalone: true,
  imports: [NgxEchartsDirective],
  templateUrl: './heat-map-echart.component.html',
  styleUrl: './heat-map-echart.component.scss',
  providers: [provideEchartsCore({ echarts }), EchartDataService]
})
export class HeatMapEchartComponent implements OnChanges {
  constructor(private echartService: EchartDataService) { }
  // private readonly hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
  // private readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  @Input() data: any[] = [];
  @Input() column: any[] = [];
  @Input()callback:any=null;
  @Input()interval:any=null;
  count:number=0;
  //@Input() changeData:any=(finalDataObj:any)=>{};
  finalData: any = {};
  xaxisData: any[] = [];
  yaxisData: any[] = [];
  startIndex:number=0;
  endIndex:number=0;
  heatMapMatrix: any[] = [];
  chartInstance!: ECharts;
   chartType="heatmap";
  
 // @Input()interval:{intervalCount:Number,intervalTime:Number}={intervalCount:0,intervalTime:5000};
  ngOnChanges(changes: SimpleChanges): void {
  
    this.chartInstance?.clear();
    this.xaxisData = [];
    this.yaxisData = [];
    this.heatMapMatrix = [];

    if (this.data.length > 0 && this.column.length > 0) {
      this.finalData = this.echartService.getDataSetFor_eCharts(this.column, this.data, "multi");
      // this.xaxisData=this.finalData?.xAxis?.data[0]?.data||[];
      this.yaxisData = this.finalData?.xAxis?.data[0]?.data || [];
      //  this.legend = this.finalData.legend;
      // this.renderChart();
      this.yaxisData=this.yaxisData;
      
      this.finalData.series.forEach((row: any, i: number) => {
        //  this.yaxisData.push(row.name);
        this.xaxisData.push(row.name);
        let shift=this.getRange();
        this.startIndex=shift[0];
        this.endIndex=shift[1];
       ( this.interval?row.data.slice(this.startIndex,this.endIndex):row.data).forEach((col: any, j: number) => {
          this.heatMapMatrix.push([i, j, (col ? col : 0)]);
        });
      });
      this.reRenderChart();
    }
  }

  onChartInit(chart: any) {
    this.chartInstance = chart;
  }
  reRenderChart() {
    //this.chartOption.xAxis.data=this.xaxisData;
    // this.chartOption.yAxis.data=this.yaxisData.map((res)=>{ return res.length>5?res.substring(0,5):res});
    this.chartOption.xAxis.data = this.xaxisData.map((res) => { return res.length > 5 ? res.substring(0, 30) : res });
    
    this.chartOption.yAxis.data =(this.interval?this.yaxisData.slice(this.startIndex,this.endIndex):this.yaxisData);
    this.chartOption.series[0].data = this.heatMapMatrix;
    this.chartOption = { ...this.chartOption };
  }

  chartOption: any = {
    animation: true,
     animationDuration: 1500,
     animationDurationUpdate: 800,
    // animationEasingUpdate: 'cubicInOut',
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const [day, hour, value] = params.value;
        return `${this.xaxisData[day]}<br>${this.yaxisData[hour]}: <b>${value}</b> transactions`;
      }
    },
    grid: {
      top: 10,
      left: 10,
      right: 20,
      bottom: 70
    },
    xAxis: {
      type: 'category',
      data: this.xaxisData,
      splitArea: { show: true },
      axisLabel: {
        interval: 0, show: true,
        fontSize: 8,
        font:'arial',
        fontWeight: 'bold',
      //  color:'#2c2d2d',
        rotate: 40,
        margin: 5,
        z: 99999

      },


    },
    yAxis: {
      type: 'category',
      data: this.yaxisData,
      splitArea: { show: true },
      axisLabel: {
        interval: 0, 
        fontSize: 8,
        fontWeight: 'bold',
      },

    },
    visualMap: {
      show: false,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 8,
      fontSize: 10,
      inRange: {
        color: ['#E0F2FE', '#38BDF8','#38BDF8', '#2563EB', '#1E3A8A']
      }
    },
    
    series: [
      {
        name: '',
        type: 'heatmap',
        data: [] as any,
        label: {
          show: true,
          color: '#2a180f',
          formatter: (params: any) => params.value[2],
           fontSize: 12,
            fontWeight: 500,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.35)',
            borderColor: '#D1D5DB',
            borderWidth: 1,
             borderRadius: 3,
             fontSize: 8,
           fontWeight: 'bold',
          }
        },
         itemStyle: {
      borderColor: '#FFFFFF',
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 8,
        fontWeight: 'bold',
    },
      }
    ]
  };

getRange(): [number, number] {
  const start = (this.count % 3) * 8;
  const end = start + this.interval;

  this.count++;

  return [start, end];
}
}
