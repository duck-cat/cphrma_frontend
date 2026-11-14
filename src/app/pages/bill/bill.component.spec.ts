import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillComponent } from './bill.component';
import { BillingRecord, BillingService } from '../../services/billing.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { HomeService } from '../home-page/home-page-data.service';

describe('BillComponent', () => {
  let component: BillComponent;
  let fixture: ComponentFixture<BillComponent>;
  const billingRecords: BillingRecord[] = [
    {
      _rowIndex: 0,
      billNumber: 'BILL-001',
      customerName: 'Northwind Pharmacy',
      customerEmail: 'billing@example.com',
      type: 'Invoice',
      issueDate: '2026-11-01',
      dueDate: '2026-11-15',
      status: 'Paid',
      paymentMethod: 'Card',
      description: 'Medication order',
      quantity: 2,
      unitPrice: 50,
      taxRate: 10,
      subtotal: 100,
      taxAmount: 10,
      total: 110,
    },
    {
      _rowIndex: 1,
      billNumber: 'BILL-002',
      customerName: 'Acme Clinic',
      customerEmail: '',
      type: 'Service',
      issueDate: '2026-11-02',
      dueDate: '2026-11-16',
      status: 'Pending',
      paymentMethod: 'Cash',
      description: 'Consultation',
      quantity: 1,
      unitPrice: 40,
      taxRate: 0,
      subtotal: 40,
      taxAmount: 0,
      total: 40,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillComponent],
      providers: [
        {
          provide: BillingService,
          useValue: { getAll: () => of(billingRecords) },
        },
        {
          provide: HomeService,
          useValue: { eventSignal: signal(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should summarize paid and outstanding billings', () => {
    expect(component.totalBilled).toBe(150);
    expect(component.totalPaid).toBe(110);
    expect(component.totalOutstanding).toBe(40);
  });

  it('should filter billing history by status and customer search', () => {
    component.statusFilter = 'Pending';
    component.searchText = 'acme';

    expect(component.filteredBillings.map((billing) => billing.billNumber)).toEqual(['BILL-002']);
  });
});
