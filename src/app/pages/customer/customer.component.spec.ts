import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerComponent } from './customer.component';
import { CustomerService } from '../../services/customer.service';
import { HomeService } from '../home-page/home-page-data.service';
import { CommonTableService } from '../../components/common-table/common-table.service';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('CustomerComponent', () => {
  let component: CustomerComponent;
  let fixture: ComponentFixture<CustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerComponent],
      providers: [
        { provide: CustomerService, useValue: { getAll: () => of([]) } },
        { provide: HomeService, useValue: { eventSignal: signal(null) } },
        { provide: CommonTableService, useValue: new CommonTableService() },
        { provide: MessageService, useValue: { add: jasmine.createSpy('add') } },
        { provide: DialogService, useValue: { open: jasmine.createSpy('open') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
