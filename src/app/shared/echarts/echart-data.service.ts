import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EchartDataService {
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
  getLangChange(code: string, defaultValue: string): string {
    return defaultValue;
  }

  private getEchartStrecture(flag: boolean = false): any {
    return {
      color: [],
      tooltip: {},
      legend: {},
      grid: {},
      xAxis: {},
      yAxis: {},
      series: flag ? [{ data: [] }] : [],
      chartTitle: ""
    };
  }

  setToolTip(obj: any) {
    obj.tooltip = {
      trigger: 'axis',
      axisPointer: {
      },
      z: 99999,
      zlevel: 10000,
      extraCssText: 'z-index: 99999;',
      className:"wms-tooltip",
    };
  }

  setColorsForEchart(obj: any, length: number, yAxisField: any=null) {
    if(yAxisField && yAxisField.length>0){
        yAxisField.map((res:any)=>{
            if(res['shm_lookup'] && (res['shm_lookup']).split(",")[1]){
               obj.color.push((res['shm_lookup']).split(",")[1]);
            }else{
                obj.color.push(this.getNextColor());
            }
        });
    }else{
       obj.color = this.getColourArray(length);
    }
  }

  setLegendForEchart(obj: any, legendData: any) {
    obj.legend = {
      ...legendData,
      //   bottom: 0,  //default value
      //   left: 'center' ,//default value
      show: true,
    };
  }
  setGridForEchart(obj: any, gridData: any) {
    obj.grid = {
      ...gridData,
    }

  }

  setXAxisForechart(obj: any, data: any[], type: string = 'category', boundaryGap: boolean = true) {
    obj.xAxis = {
      type: type,
      boundaryGap: boundaryGap,
      data: data
    }
  }

  setYAxisForechart(obj: any, data: any[], type: string = 'value') {
    obj.yAxis = {
      type: type,
      //data: data
      splitLine: {
        lineStyle: { color: '#E5E7EB' }
      }
    }
  }
  setSeriesForEchart(obj: any, seriesData: any[]) {
    obj.series = seriesData;
  }
  getXaxisObject() {
    return {
      name: '',
      type: "",
      data: []
    }

  }
  getYaxisObject() {
    return {
      name: '',
      // type:"",
      data: []
    }

  }

  getDataSetFor_eCharts(coloums: any[], data: any[], type: string = "multi"): any {

    let chartDataStructure = this.getEchartStrecture(type == "single");
    let chartData = coloums?.filter(res => res["shm_lookup"] == "" || !res["shm_lookup"])[0] || {};
    chartDataStructure.chartTitle = this.getLangChange(chartData["columndisplay"], chartData["mappedfield"]);
    let xAxisField: any[] = coloums?.filter((res) => {
      return res["shm_lookup"] == "xaxis" || (res["shm_lookup"].split("@")[0])?.trim() == "xaxis";
    });
    
    let yAxisField: any[] = coloums?.filter((res) => {
      return res["shm_lookup"] == "yaxis" || res["shm_lookup"].split(",")[0] == "yaxis";
    });
    let multiColor = chartData?.shm_mand == 1 ? true : false;
    let isLegend = chartData.shm_readonly == 1 ? true : false;

    let xAxisDataObj: { name: string, data: any[] }[] = [];
    let yAxisDataObj: { name: string, data: any[] }[] = [];
    let seriesObject = [];
    if (yAxisField.length > 0 && xAxisField.length > 0 && type == "multi") {
      xAxisField.map((colmn: any, index: number) => {
        xAxisDataObj[index] = this.getXaxisObject();
        //let xAxis = colmn["mappedfield"]||"";
        xAxisDataObj[index].name = this.getLangChange(colmn["columndisplay"], colmn["mappedfield"]);
      });

      yAxisField.map((column: any, index: number) => {
        yAxisDataObj[index] = this.getYaxisObject();
        //let xAxis = colmn["mappedfield"]||"";
        yAxisDataObj[index].name = this.getLangChange(column["columndisplay"], column["mappedfield"]);
      });

      data.forEach((res: any, index: number) => {
        xAxisField.map((xres: any, i: number) => {
          xAxisDataObj[i].data.push(res[xres['mappedfield']]);
        });
        yAxisField.map((yres: any, i: number) => {
          yAxisDataObj[i].data.push(res[yres['mappedfield']]);
        });
      });

      // set data 
      this.setGridForEchart(chartDataStructure, {});
      if (multiColor) {
        this.setColorsForEchart(chartDataStructure, yAxisField.length,yAxisField);
      }
      if (isLegend) {
        this.setLegendForEchart(chartDataStructure, {});
      }else {
        chartDataStructure.legend={show:false};
      }
      this.setToolTip(chartDataStructure);
      this.setXAxisForechart(chartDataStructure, xAxisDataObj);
      this.setYAxisForechart(chartDataStructure, []);
      this.setSeriesForEchart(chartDataStructure, yAxisDataObj);
      let splitVal=xAxisField[0]['shm_lookup']?.split("@")||[];
      chartDataStructure.wms_properties=splitVal.length>1?splitVal[1]:{};
      return chartDataStructure;
    } else if (type == "single" && yAxisField.length > 0 && xAxisField.length > 0) {
      this.setGridForEchart(chartDataStructure, {});
      if (multiColor) {
        this.setColorsForEchart(chartDataStructure, data.length);
      }
      if (isLegend) {
        this.setLegendForEchart(chartDataStructure, isLegend ? {} : { show: false });
      }else {
        chartDataStructure.legend={show:false};
      }
      this.setToolTip(chartDataStructure);
      let dataObj: { value: number, name: string }[] = [];

      data.forEach((res: any, index: number) => {
        let obj = { name: "", value: 0 };
        let isReq = false;
        xAxisField.map((xres: any) => {
          isReq = xres["shm_mand"] == 1 ? true : false;
          if (!isReq) {
            obj.name = res[xres['mappedfield']];
          } else {
            obj.name = xres['mappedfield'];
            obj.value = res[xres['mappedfield']];
            dataObj.push(obj);
          }
        });
        yAxisField.map((yres: any) => {
          //yAxisDataObj[index].data.push(res[yres['mappedfield']]);
          isReq = yres["shm_mand"] == 1 ? true : false;
          if (!isReq) {
            obj.value = res[yres['mappedfield']];
          } else {
            obj.name = yres['mappedfield'];
            obj.value = res[yres['mappedfield']];
            dataObj.push(obj);
          }

        });
        if (!isReq) {
          dataObj.push(obj);
        }

      });

      chartDataStructure.series[0].data = dataObj;
      let splitVal=xAxisField[0]['shm_lookup']?.split("@")||[];
      chartDataStructure.wms_properties=splitVal.length>1?splitVal[1]:{};
      //chartDataStructure.name=chartDataStructure.chartTitle;

      return chartDataStructure;
    }


    return [];
  }

  chartColors = [
    'rgb(100, 181, 246)',  // Light Blue
    'rgb(255, 183, 77)',   // Light Orange
    'rgb(129, 199, 132)',  // Light Green
    'rgb(239, 154, 154)',  // Light Red
    'rgb(186, 104, 200)',  // Light Purple
    'rgb(255, 213, 79)',   // Light Yellow
    'rgb(77, 208, 225)',   // Light Cyan
    'rgb(244, 143, 177)',  // Light Pink
    'rgb(144, 202, 249)',  // Sky Blue
    'rgb(255, 167, 106)',  // Peach

    'rgb(102, 187, 106)',  // Green
    'rgb(239, 83, 80)',     // Coral Red
    'rgb(171, 71, 188)',    // Violet
    'rgb(255, 202, 40)',    // Amber
    'rgb(38, 198, 218)',    // Teal
    'rgb(121, 134, 203)',   // Indigo
    'rgb(236, 112, 160)',   // Rose
    'rgb(156, 204, 101)',   // Lime
    'rgb(255, 193, 93)',    // Gold
    // 'rgb(120, 144, 156)',   // Blue Gray

    'rgb(79, 172, 254)',    // Bright Blue
    'rgb(255, 159, 67)',    // Orange
    'rgb(102, 204, 153)',   // Mint
    'rgb(255, 112, 112)',   // Soft Red
    'rgb(174, 120, 221)',   // Purple
    'rgb(255, 210, 90)',    // Yellow
    'rgb(67, 190, 205)',    // Aqua
    'rgb(240, 128, 170)',   // Pink
    'rgb(120, 190, 235)',   // Blue
    'rgb(245, 170, 100)'    // Light Brown
  ];

  getColourArray(len: number): any[] {
    let colors: any[] = [];
    for (let i = 0; i < len; i++) {
      colors.push(this.getNextColor());
    }
    return colors;
  }
  private colorIndex = 0;

  getNextColor(): string {
    const color = this.chartColors[this.colorIndex % this.chartColors.length];
    this.colorIndex++;
    return color;
  }


  finalPropImplement(chartProperty: any, prop: any,type="bar"): any {
    try {
      if(!prop){return chartProperty}
      prop = JSON.parse(prop?.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
        ?.replace(/'/g, '"'));
      if (Object.keys(prop).length > 0) {
        if (prop?.hasOwnProperty("legend")) {
          chartProperty["legend"] = { ...chartProperty["legend"], ...prop['legend'] };
        }
        if (prop?.hasOwnProperty("grid")) {
          chartProperty["grid"] = prop["grid"];
        }
        if(type=="donut" && prop.hasOwnProperty("radius")){
           chartProperty['series'][0]['radius']=prop['radius'];
        }
        if(type=="donut" && prop.hasOwnProperty("center")){
           chartProperty['series'][0]['center']=prop['center'];
        }
        if(type=="donut" && prop.hasOwnProperty("color")){
         
          chartProperty['color']=prop.color;
        }
         if(type=="bar" && prop.hasOwnProperty("section") && prop['section']==true){
           chartProperty.xAxis.splitArea=this.markSection.splitArea;
           chartProperty.xAxis.splitLine=this.markSection.splitLine;
        }
        
      }
      return chartProperty;
    } catch (e) {
      console.error(e);
      return chartProperty
    }
  }
}
