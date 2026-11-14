import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import {CommonTableComponent} from "../../components/common-table/common-table.component";
import {CommonTableService} from "../../components/common-table/common-table.service";
import {columnsMap} from "../../shared/common-column.config";
import {SupplierService} from "../../services/supplier.service";
import { MessageService } from 'primeng/api';
import {HomeService} from "../home-page/home-page-data.service";
import {Subscription} from "rxjs";
import {CommonDialogComponent} from "../../components/common-dialog/common-dialog.component";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [CommonTableComponent],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent implements OnInit ,OnDestroy {
  supplierColumn:any[]=columnsMap['supplier'];
  supplierDetails:any[]=[];
   supplierSub=new Subscription();
   dialogRef!:DynamicDialogRef;
  constructor(private dialogServ:DialogService,private eventService:HomeService,private dataTransfer:CommonTableService,private supplierServ:SupplierService,private messageService:MessageService){
     effect(()=>{
        let selectedMenu=this.eventService.eventSignal();
        console.log(selectedMenu);
        if(selectedMenu.type=='supplier'){
            this.addSupplier();
        }
        console.log("add event is called");
     });

  }
  ngOnInit(): void {
    console.log("supplier called");
    this.setColumn();
    this.loadSupplier();
   
  }
  addSupplier(){
    this.dialogRef = this.dialogServ.open(CommonDialogComponent, {
      header: 'Add Supplier',
      width: '70%',
      modal: true,
      closable: true,
      draggable: true,
      breakpoints: {
        '960px': '80vw',
        '640px': '95vw',
      },
      data: {
        title: 'Employee Details',
        fields: this.supplierColumn,
        layout: 'grid',
        columns: 2,
        initialValue: {},
      },
    });
    this.dialogRef.onClose.subscribe((data)=>{
      console.log(data);
      this.addSupplierData(data);
    })
  }

   addSupplierData(data:any){
        this.supplierServ.create(data).subscribe((res)=>{
            debugger;
            console.log(res);
        });
   }
  loadSupplier(){
     this.supplierServ.getAll().subscribe({
      next: (data) => {debugger;
        this.supplierDetails = data;
      //  this.dataMap['inventory'] = data;
        this.dataTransfer.setGridData(this.supplierDetails);
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
    })
  }
  setColumn(){
     this.dataTransfer.setColumnData(this.supplierColumn);
  }
  triggerAction(event:any){
      if(event.action=="edit"){
        this.editSupplierData(event?.rowData[0])
      }
      else if(event.action=="delete"){
          this.deleteSupplier(event?.rowData[0]);
      }
  }
  deleteSupplier(data:any){
    let deleteIndex=data.supplierId;
    let flag=confirm("Are you sure , you wnats to delete the record");
    if(flag){
       this.supplierServ.delete(deleteIndex).subscribe({
         next:(res)=>{
           console.log(res);
         }
       })
    }
  }
  editSupplierData(data:any){
    this.dialogRef=  this.dialogServ.open(CommonDialogComponent, {
      header: 'Edit Supplier',
      width: '70%',
      modal: true,
      closable: true,
      draggable: true,
      breakpoints: {
        '960px': '80vw',
        '640px': '95vw',
      },
      data: {
       // title: 'Employee Details',
        fields: this.supplierColumn,
        layout: 'grid',
        columns: 2,
        initialValue:data,
      },
    });
    this.dialogRef.onClose.subscribe((res)=>{
        this.updateSupplierData(res)
    });
  }
  updateSupplierData(data:any){
    this.supplierServ.update(data?.supplierId,data).subscribe({
       next:(data)=>{
         console.log(data);
         this.loadSupplier();
       }
    });
  }
  ngOnDestroy(): void {
    this.supplierSub.unsubscribe();
  }
}
