import { Component } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {DialogModule} from "primeng/dialog";
import {DynamicField} from "./../common-form/common-form.model";
import {CommonFormComponent} from "../common-form/common-form.component";
@Component({
  selector: 'app-common-dialog',
  standalone: true,
  imports: [DialogModule,CommonModule, ReactiveFormsModule, ButtonModule,CommonFormComponent],
  templateUrl: './common-dialog.component.html',
  styleUrl: './common-dialog.component.css',
})
export class CommonDialogComponent {

   fields: DynamicField[] = [];

  title = 'Dynamic Form';

  layout: 'vertical' | 'grid' = 'grid';

  columns = 3;

  form = new FormGroup({
    dynamicForm: new FormControl<any>({})
  });

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) {

    const data = this.config.data || {};

    this.fields = data.fields || [];

    this.title = data.title || 'Dynamic Form';

    this.layout = data.layout || 'grid';

    this.columns = data.columns || 2;

    if (data.initialValue) {

      this.form.patchValue({
        dynamicForm: data.initialValue
      });

    }
  }

  submit(): void {

    if (this.form.invalid) {

      this.dynamicControl.markAsTouched();

      return;
    }

    const result = this.dynamicControl.getRawValue();

    // Return data to parent component
    this.ref.close(result);
  }

  cancel(): void {

    // Close without returning form data
    this.ref.close(null);
  }

  get dynamicControl(): FormControl {

    return this.form.get('dynamicForm') as FormControl;
  
}
}
