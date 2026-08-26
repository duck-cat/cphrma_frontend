import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-approval-dialog',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './approval-dialog.component.html',
  styleUrl: './approval-dialog.component.css'
})
export class ApprovalDialogComponent {
  constructor(private config: DynamicDialogConfig,
    private ref: DynamicDialogRef){}

    closeDialog(){
       this.ref.close();
    }
}
