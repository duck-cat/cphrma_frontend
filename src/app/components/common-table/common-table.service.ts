import { Injectable,signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonTableService {

   coloum=signal<any[]>([]);
   gridData=signal<any[]>([]);

  constructor() { }
  
  setColumnData(coloum:any[]){
     this.coloum.set(coloum);
  }
  setGridData(data:any[]){
     this.gridData.set(data);
  }

}
