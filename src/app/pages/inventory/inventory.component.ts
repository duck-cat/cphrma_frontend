import { Component, OnInit ,effect} from '@angular/core';
import { CommonTableComponent } from '../../components/common-table/common-table.component';
import { CommonTableService } from '../../components/common-table/common-table.service';
import { columnsMap } from '../../shared/common-column.config';
import {InventoryService} from "../../services/inventory.service";
import { MessageService } from 'primeng/api';
import {HomeService} from "../home-page/home-page-data.service";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {CommonDialogComponent} from "../../components/common-dialog/common-dialog.component";
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonTableComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  inventoryColumns:any[] = columnsMap['inventory'];
  inventoryData:any[]=[];
  dialogRef!:DynamicDialogRef;
  supplierInfo:any[]=[];
  constructor(private dialogServ:DialogService,private eventServ:HomeService,private dataTransfer: CommonTableService,private inventoryService:InventoryService,private messageService:MessageService) {
    effect(()=>{
        let selectedMenu=this.eventServ.eventSignal();
        if(selectedMenu.type=="inventory"){
          this.addInventoryDialog();
        }
    });
  }
  ngOnInit(): void {
    this.setColoum();
    this.loadInventory();
    this.getSupplierInfo();
  }
  setColoum() {
    this.dataTransfer.setColumnData(this.inventoryColumns);
  }
  loadInventory(): void {
   // this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventoryData = data;
      //  this.dataMap['inventory'] = data;
        this.dataTransfer.setGridData(this.inventoryData);
     
      //  this.loading = false;
      //  this.resetTableAsPerMenu();
      },
      error: () => {
        //this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load inventory. Is the backend running?',
          life: 5000,
        });
      },
    });
  }
  addInventoryDialog(){
   this.dialogRef=this.dialogServ.open(CommonDialogComponent,{
      header: 'Add Inventory',
      width: '70%',
      modal: true,
      closable: true,
      draggable: true,
      breakpoints: {
        '960px': '80vw',
        '640px': '95vw',
      },
      data: {
        fields: this.inventoryColumns,
        layout: 'grid',
        columns: 2,
        initialValue: {},
        dropdown:{supplier:this.supplierInfo }
      },
      
    })
  }
  getSupplierInfo(){
      this.inventoryService.getSupplierInfo().subscribe({
         next:(data:any)=>{
          this.supplierInfo=data?.supplierInfo
         }
      })
  }
  triggerAction(eventType: any) {
    try {
      debugger;
      if (eventType.action == 'edit') {
      }
    } catch (e) {
      console.error(e);
    }
  }
}
