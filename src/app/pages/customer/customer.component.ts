import { Component, effect, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonTableComponent } from '../../components/common-table/common-table.component';
import { CommonTableService } from '../../components/common-table/common-table.service';
import { CommonDialogComponent } from '../../components/common-dialog/common-dialog.component';
import { CustomerPayload, CustomerRecord, CustomerService } from '../../services/customer.service';
import { columnsMap } from '../../shared/common-column.config';
import { HomeService } from '../home-page/home-page-data.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, CommonTableComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit, OnDestroy {
  readonly customerColumns = columnsMap['customer'];
  customers: CustomerRecord[] = [];
  loading = false;
  dialogRef?: DynamicDialogRef;
  private readonly subscriptions = new Subscription();

  constructor(
    private dialogService: DialogService,
    private homeService: HomeService,
    private tableService: CommonTableService,
    private customerService: CustomerService,
    private messageService: MessageService,
  ) {
    effect(() => {
      if (this.homeService.eventSignal()?.type === 'customer') {
        this.homeService.eventSignal.set(null);
        this.openCustomerDialog();
      }
    });
  }

  ngOnInit(): void {
    this.tableService.setColumnData(this.customerColumns);
    this.loadCustomers();
  }

  openCustomerDialog(customer?: CustomerRecord): void {
    this.dialogRef = this.dialogService.open(CommonDialogComponent, {
      header: customer ? 'Edit Customer' : 'Add Customer',
      width: '70%',
      modal: true,
      closable: true,
      draggable: true,
      breakpoints: {
        '960px': '80vw',
        '640px': '95vw',
      },
      data: {
        fields: this.customerColumns,
        layout: 'grid',
        columns: 2,
        initialValue: customer
          ? {
              ...customer,
              dob: customer.dob ? new Date(`${customer.dob.slice(0, 10)}T00:00:00`) : null,
            }
          : {},
      },
    });

    this.subscriptions.add(
      this.dialogRef.onClose.subscribe((values: CustomerPayload | null | undefined) => {
        if (!values) return;
        if (customer) {
          this.updateCustomer(customer.member_id, values);
        } else {
          this.addCustomer(values);
        }
      }),
    );
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.tableService.setGridData(customers);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load customers. Check that the backend is running and try again.',
          life: 5000,
        });
      },
    });
  }

  handleTableAction(event: { action: string; rowData: CustomerRecord[] }): void {
    const customer = event.rowData[0];
    if (!customer) return;

    if (event.action === 'view') {
      this.messageService.add({
        severity: 'info',
        summary: customer.name,
        detail: `${customer.member_id} · ${customer.mobile} · ${customer.email || 'No email'}`,
        life: 5000,
      });
    } else if (event.action === 'edit') {
      this.openCustomerDialog(customer);
    } else if (event.action === 'delete') {
      this.deleteCustomer(customer);
    }
  }

  private addCustomer(customer: CustomerPayload): void {
    this.customerService.create(this.normalizeCustomer(customer)).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Customer added',
          detail: `${customer.name} was added successfully.`,
        });
        this.loadCustomers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not add customer. Please check the customer details and try again.',
          life: 5000,
        });
      },
    });
  }

  private updateCustomer(memberId: string, customer: CustomerPayload): void {
    this.customerService.update(memberId, this.normalizeCustomer(customer)).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Customer updated',
          detail: `${customer.name} was updated successfully.`,
        });
        this.loadCustomers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not update customer. Please try again.',
          life: 5000,
        });
      },
    });
  }

  private deleteCustomer(customer: CustomerRecord): void {
    if (!window.confirm(`Delete customer ${customer.name} (${customer.member_id})? This cannot be undone.`)) {
      return;
    }

    this.customerService.delete(customer.member_id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Customer deleted',
          detail: `${customer.name} was deleted.`,
        });
        this.loadCustomers();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete customer. Please try again.',
          life: 5000,
        });
      },
    });
  }

  private normalizeCustomer(customer: CustomerPayload): CustomerPayload {
    const dob: unknown = customer.dob;
    return {
      ...customer,
      dob: dob instanceof Date ? this.toDateString(dob) : String(dob ?? ''),
    };
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.dialogRef?.close(null);
  }
}
