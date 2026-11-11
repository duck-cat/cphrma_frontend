
import {
  Component,
  Input,
  forwardRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';

import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';

import {
  DynamicField,
  DynamicFormValue
} from './common-form.model';

import {BarcodeScannerComponent} from "../barcode-scanner/barcode-scanner.component";

@Component({
  selector: 'app-common-form',
  standalone: true,
  imports: [
    BarcodeScannerComponent,
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    CalendarModule,
    InputNumberModule,
    InputTextareaModule
  ],
  templateUrl: './common-form.component.html',
  styleUrl: './common-form.component.css',
   providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CommonFormComponent),
      multi: true
    }
  ]
})
export class CommonFormComponent implements ControlValueAccessor, OnChanges, OnDestroy {

  @Input() fields: DynamicField[] = [];

  @Input() layout: 'vertical' | 'grid' = 'vertical';

  @Input() columns = 3;
  @Output() scanned=new EventEmitter<any>();

  form!: FormGroup;

  private pendingValue: DynamicFormValue = {};

  private disabled = false;

  private valueSubscription?: Subscription;

  private onChange: (value: DynamicFormValue) => void = () => {};

  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['fields']) {
      this.buildForm();
    }
  }
  barcodeInfo($event:any){
     this.scanned.emit($event);
  }

  // -----------------------------------
  // Build dynamic form
  // -----------------------------------

  private buildForm(): void {

    const previousValue = this.form?.getRawValue() ?? {};

    this.valueSubscription?.unsubscribe();

    const controls: Record<string, FormControl> = {};

    this.fields.forEach(field => {

      const value =
        previousValue[field.field] !== undefined
          ? previousValue[field.field]
          : this.pendingValue[field.field] !== undefined
            ? this.pendingValue[field.field]
            : field.initialValue !== undefined
              ? field.initialValue
              : this.getDefaultValue(field);

      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.minLength !== undefined) {
        validators.push(Validators.minLength(field.minLength));
      }

      if (field.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }

      controls[field.field] = this.fb.control(
        {
          value,
          disabled: this.disabled || !!field.disabled
        },
        validators
      ) as FormControl;

    });

    this.form = this.fb.group(controls);

    this.valueSubscription = this.form.valueChanges.subscribe(() => {

      this.onChange(this.form.getRawValue());

      this.onTouched();

    });
  }

  private getDefaultValue(field: DynamicField): any {

    switch (field.type) {

      case 'checkbox':
        return [];

      case 'checkbox-single':
        return false;

      default:
        return null;
    }
  }

  // -----------------------------------
  // ControlValueAccessor
  // -----------------------------------

  writeValue(value: DynamicFormValue | null): void {

    this.pendingValue = value ?? {};

    if (this.form) {

      const updatedValue: DynamicFormValue = {};

      this.fields.forEach(field => {

        updatedValue[field.field] =
          this.pendingValue[field.field] !== undefined
            ? this.pendingValue[field.field]
            : field.initialValue !== undefined
              ? field.initialValue
              : this.getDefaultValue(field);

      });

      this.form.patchValue(updatedValue, {
        emitEvent: false
      });
    }
  }

  registerOnChange(fn: (value: DynamicFormValue) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {

    this.disabled = isDisabled;

    if (!this.form) {
      return;
    }

    this.fields.forEach(field => {

      const control = this.form.get(field.field);

      if (!control) {
        return;
      }

      if (isDisabled || field.disabled) {
        control.disable({ emitEvent: false });
      } else {
        control.enable({ emitEvent: false });
      }

    });
  }

  // -----------------------------------
  // Helpers
  // -----------------------------------

  getOptions(field: DynamicField) {

    return (field.options ?? []).map(item => ({
      label: item.label,
      value: item.option,
      disabled: item.disabled ?? false
    }));
  }

  getControl(field: string): FormControl {
    return this.form.get(field) as FormControl;
  }

  isInvalid(field: string): boolean {

    const control = this.form.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  getErrorMessage(field: DynamicField): string {

    const control = this.form.get(field.field);

    if (control?.hasError('required')) {
      return `${field.title} is required`;
    }

    if (control?.hasError('minlength')) {
      return `${field.title} is too short`;
    }

    if (control?.hasError('maxlength')) {
      return `${field.title} is too long`;
    }

    if (control?.hasError('min')) {
      return `${field.title} is below the minimum value`;
    }

    if (control?.hasError('max')) {
      return `${field.title} exceeds the maximum value`;
    }

    return 'Invalid value';
  }

  markAllAsTouched(): void {

    this.form.markAllAsTouched();

    this.onTouched();
  }

  ngOnDestroy(): void {
    this.valueSubscription?.unsubscribe();
  }
}
