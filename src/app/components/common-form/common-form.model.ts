

export type DynamicFieldType =
  | 'text'
  | 'password'
  | 'dropdown'
  | 'radio'
  | 'checkbox'
  | 'checkbox-single'
  | 'datepicker'
  | 'number'
  | 'textarea';

export interface DynamicOption {
  option: string | number | boolean;
  label: string;
  disabled?: boolean;
}

export interface DynamicField {
  field: string;
  title: string;
  type: DynamicFieldType;

  initialValue?: any;
  options?: DynamicOption[];

  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;

  helpText?: string;
  dropdownValue:{
     option:string,
     value:string,
     disabled:boolean
  }[]
}

export interface DynamicFormValue {
  [field: string]: any;
}
