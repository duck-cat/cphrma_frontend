import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BillingRecord, BillingService } from '../../services/billing.service';
import { HomeService } from '../home-page/home-page-data.service';
import { CommonFormComponent } from '../../components/common-form/common-form.component';
import { CommonTableComponent } from '../../components/common-table/common-table.component';
import { CommonTableService } from '../../components/common-table/common-table.service';
import { DynamicField } from '../../components/common-form/common-form.model';

type BillingDraft = Omit<BillingRecord, '_rowIndex'>;

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonFormComponent, CommonTableComponent],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css',
})
export class BillComponent implements OnInit {
  @ViewChild(CommonFormComponent) billingFormComponent?: CommonFormComponent;

  billings: BillingRecord[] = [];
  searchText = '';
  statusFilter = 'All';
  typeFilter = 'All';
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';
  formOpen = false;
  selectedBilling: BillingRecord | null = null;
  editingRow: number | null = null;
  draft!: BillingDraft;
  formFields: DynamicField[] = [];

  readonly billingTypes = ['Invoice', 'Receipt', 'Credit note', 'Purchase', 'Service', 'Other'];
  readonly billingStatuses = ['Paid', 'Pending', 'Overdue', 'Cancelled'];
  readonly paymentMethods = ['Cash', 'Card', 'Bank transfer', 'Other'];
  readonly tableColumns = [
    { field: 'billNumber', title: 'Bill number', show_tbl: 1 },
    { field: 'customerName', title: 'Customer', show_tbl: 1 },
    { field: 'type', title: 'Type', show_tbl: 1 },
    { field: 'issueDate', title: 'Issue date', show_tbl: 1 },
    { field: 'dueDate', title: 'Due date', show_tbl: 1 },
    { field: 'status', title: 'Status', show_tbl: 1 },
    {
      field: 'total',
      title: 'Total',
      hozAlign: 'right',
      show_tbl: 1,
      formatter: (cell: { getValue: () => number }) => this.formatMoney(cell.getValue()),
    },
  ];

  constructor(
    private billingService: BillingService,
    private homeService: HomeService,
    private tableService: CommonTableService,
  ) {
    this.draft = this.createEmptyDraft();
    effect(() => {
      if (this.homeService.eventSignal()?.type === 'billing') {
        this.homeService.eventSignal.set(null);
        this.openNewBilling();
      }
    });
  }

  ngOnInit(): void {
    this.tableService.setColumnData(this.tableColumns);
    this.formFields = this.createFormFields(this.draft);
    this.loadBillings();
  }

  get filteredBillings(): BillingRecord[] {
    const query = this.searchText.trim().toLowerCase();
    return this.billings.filter((billing) => {
      const matchesSearch =
        !query ||
        [
          billing.billNumber,
          billing.customerName,
          billing.customerEmail,
          billing.type,
          billing.description,
        ].some((value) => String(value ?? '').toLowerCase().includes(query));
      const matchesStatus = this.statusFilter === 'All' || billing.status === this.statusFilter;
      const matchesType = this.typeFilter === 'All' || billing.type === this.typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }

  get totalBilled(): number {
    return this.billings
      .filter((billing) => billing.status !== 'Cancelled')
      .reduce((total, billing) => total + Number(billing.total || 0), 0);
  }

  get totalPaid(): number {
    return this.billings
      .filter((billing) => billing.status === 'Paid')
      .reduce((total, billing) => total + Number(billing.total || 0), 0);
  }

  get totalOutstanding(): number {
    return this.billings
      .filter((billing) => billing.status === 'Pending' || billing.status === 'Overdue')
      .reduce((total, billing) => total + Number(billing.total || 0), 0);
  }

  get formSubtotal(): number {
    const values = this.billingFormComponent?.form?.getRawValue();
    return Number(values?.['quantity'] ?? this.draft.quantity) * Number(values?.['unitPrice'] ?? this.draft.unitPrice);
  }

  get formTax(): number {
    const values = this.billingFormComponent?.form?.getRawValue();
    return this.formSubtotal * (Number(values?.['taxRate'] ?? this.draft.taxRate) / 100);
  }

  loadBillings(): void {
    this.loading = true;
    this.errorMessage = '';
    this.billingService.getAll().subscribe({
      next: (billings) => {
        this.billings = billings;
        this.updateTableData();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load billing history. Check that the backend is running and try again.';
        this.loading = false;
      },
    });
  }

  openNewBilling(): void {
    this.editingRow = null;
    this.draft = this.createEmptyDraft();
    this.formFields = this.createFormFields(this.draft);
    this.clearMessages();
    this.formOpen = true;
  }

  editBilling(billing: BillingRecord): void {
    this.selectedBilling = null;
    this.editingRow = billing._rowIndex;
    this.draft = {
      billNumber: billing.billNumber,
      customerName: billing.customerName,
      customerEmail: billing.customerEmail ?? '',
      type: billing.type,
      issueDate: billing.issueDate,
      dueDate: billing.dueDate,
      status: billing.status,
      paymentMethod: billing.paymentMethod,
      description: billing.description,
      quantity: Number(billing.quantity),
      unitPrice: Number(billing.unitPrice),
      taxRate: Number(billing.taxRate),
      subtotal: Number(billing.subtotal),
      taxAmount: Number(billing.taxAmount),
      total: Number(billing.total),
    };
    this.formFields = this.createFormFields(this.draft);
    this.clearMessages();
    this.formOpen = true;
  }

  saveBilling(): void {
    if (this.saving) return;

    const form = this.billingFormComponent?.form;
    if (!form) return;
    if (form.invalid) {
      this.billingFormComponent?.markAllAsTouched();
      return;
    }

    const values = form.getRawValue();
    const subtotal = Number(values['quantity']) * Number(values['unitPrice']);
    const taxAmount = subtotal * (Number(values['taxRate'] || 0) / 100);
    const payload: BillingDraft = {
      ...values,
      billNumber: this.draft.billNumber || this.createBillNumber(),
      issueDate: this.toDateString(values['issueDate']),
      dueDate: this.toDateString(values['dueDate']),
      quantity: Number(values['quantity']),
      unitPrice: Number(values['unitPrice']),
      taxRate: Number(values['taxRate'] || 0),
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    };

    this.saving = true;
    this.errorMessage = '';
    const request =
      this.editingRow === null
        ? this.billingService.create(payload)
        : this.billingService.update(this.editingRow, payload);

    request.subscribe({
      next: () => {
        this.formOpen = false;
        this.saving = false;
        this.successMessage = this.editingRow === null ? 'Billing record added.' : 'Billing record updated.';
        this.loadBillings();
      },
      error: () => {
        this.errorMessage = 'Could not save this billing record. Please try again.';
        this.saving = false;
      },
    });
  }

  deleteBilling(billing: BillingRecord): void {
    if (!window.confirm(`Delete billing record ${billing.billNumber}? This cannot be undone.`)) return;

    this.clearMessages();
    this.billingService.delete(billing._rowIndex).subscribe({
      next: () => {
        this.successMessage = 'Billing record deleted.';
        this.loadBillings();
      },
      error: () => {
        this.errorMessage = 'Could not delete this billing record. Please try again.';
      },
    });
  }

  handleTableAction(event: { action: string; rowData: BillingRecord[] }): void {
    const billing = event.rowData[0];
    if (!billing) return;

    if (event.action === 'view') this.showBilling(billing);
    if (event.action === 'edit') this.editBilling(billing);
    if (event.action === 'delete') this.deleteBilling(billing);
  }

  updateTableData(): void {
    this.tableService.setGridData(this.filteredBillings);
  }

  showBilling(billing: BillingRecord): void {
    this.selectedBilling = billing;
    this.clearMessages();
  }

  closeForm(): void {
    this.formOpen = false;
  }

  closeDetails(): void {
    this.selectedBilling = null;
  }

  exportBilling(billing: BillingRecord): void {
    this.printRecords([billing], `Billing ${billing.billNumber}`);
  }

  exportHistory(): void {
    if (!this.filteredBillings.length) {
      this.errorMessage = 'There are no billing records to export.';
      return;
    }
    this.printRecords(this.filteredBillings, 'Billing history');
  }

  private printRecords(records: BillingRecord[], title: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.errorMessage = 'The billing document was blocked. Allow pop-ups to print or save it as a PDF.';
      return;
    }

    const rows = records
      .map(
        (billing) => `
          <tr>
            <td>${this.escapeHtml(billing.billNumber)}</td>
            <td>${this.escapeHtml(billing.customerName)}</td>
            <td>${this.escapeHtml(billing.type)}</td>
            <td>${this.escapeHtml(billing.issueDate)}</td>
            <td>${this.escapeHtml(billing.status)}</td>
            <td class="amount">${this.formatMoney(billing.total)}</td>
          </tr>`,
      )
      .join('');
    const singleBilling = records.length === 1 ? records[0] : null;
    const detail = singleBilling
      ? `
        <section class="document">
          <header><div><h1>Billing document</h1><p>${this.escapeHtml(singleBilling.type)}</p></div>
            <strong>${this.escapeHtml(singleBilling.billNumber)}</strong></header>
          <section class="parties">
            <div><small>BILLED TO</small><h2>${this.escapeHtml(singleBilling.customerName)}</h2>
              <p>${this.escapeHtml(singleBilling.customerEmail || '—')}</p></div>
            <div><small>ISSUED</small><p>${this.escapeHtml(singleBilling.issueDate)}</p>
              <small>DUE DATE</small><p>${this.escapeHtml(singleBilling.dueDate)}</p></div>
          </section>
          <p>${this.escapeHtml(singleBilling.description)}</p>
          <table><thead><tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Subtotal</th></tr></thead>
            <tbody><tr><td>${this.escapeHtml(singleBilling.description)}</td>
              <td>${this.escapeHtml(singleBilling.quantity)}</td>
              <td>${this.formatMoney(singleBilling.unitPrice)}</td>
              <td>${this.formatMoney(singleBilling.subtotal)}</td></tr></tbody>
          </table>
          <section class="totals">
            <p>Tax (${this.escapeHtml(singleBilling.taxRate)}%) <strong>${this.formatMoney(singleBilling.taxAmount)}</strong></p>
            <p>Status <strong>${this.escapeHtml(singleBilling.status)}</strong></p>
            <p class="grand-total">Total <strong>${this.formatMoney(singleBilling.total)}</strong></p>
            <p>Payment method <strong>${this.escapeHtml(singleBilling.paymentMethod)}</strong></p>
          </section>
        </section>`
      : `
        <h1>${this.escapeHtml(title)}</h1>
        <p>Generated ${this.escapeHtml(new Date().toLocaleDateString())}</p>
        <table><thead><tr><th>Bill #</th><th>Customer</th><th>Type</th><th>Issue date</th><th>Status</th><th class="amount">Total</th></tr></thead>
          <tbody>${rows}</tbody></table>
        <p class="summary">${records.length} billing record(s)</p>`;

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
      <html><head><title>${this.escapeHtml(title)}</title>
        <style>
          body{font:14px Arial,sans-serif;color:#172033;margin:40px}
          h1{font-size:24px;margin:0 0 6px}h2{font-size:17px;margin:8px 0}
          p{color:#586579;margin:5px 0}header,.parties{display:flex;justify-content:space-between;gap:24px}
          header{align-items:center;border-bottom:1px solid #dce2eb;padding-bottom:20px;margin-bottom:24px}
          header strong{font-size:18px}.parties{background:#f6f8fb;padding:18px;margin:20px 0}
          small{font-size:10px;letter-spacing:1px;color:#778196}
          table{width:100%;border-collapse:collapse;margin-top:24px}
          th,td{text-align:left;padding:12px 9px;border-bottom:1px solid #e1e6ee}
          th{background:#f6f8fb;font-size:12px;color:#586579}.amount{text-align:right}
          .totals{margin:24px 0 0 auto;width:260px}.totals p{display:flex;justify-content:space-between}
          .grand-total{border-top:1px solid #dce2eb;padding-top:12px;font-size:17px;color:#172033}
          .summary{margin-top:20px}@media print{body{margin:18mm}}
        </style></head><body>${detail}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 250);
  }

  private createEmptyDraft(): BillingDraft {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return {
      billNumber: '',
      customerName: '',
      customerEmail: '',
      type: this.billingTypes[0],
      issueDate: today,
      dueDate: today,
      status: 'Pending',
      paymentMethod: this.paymentMethods[0],
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 0,
      subtotal: 0,
      taxAmount: 0,
      total: 0,
    };
  }

  private createFormFields(values: Partial<BillingDraft>): DynamicField[] {
    const dropdownValues = (options: string[]) =>
      options.map((option) => ({ option, value: option, disabled: false }));
    return [
      { field: 'customerName', title: 'Customer name', type: 'text', required: true, maxLength: 120, initialValue: values.customerName ?? '', dropdownValue: [] },
      { field: 'customerEmail', title: 'Customer email', type: 'text', maxLength: 160, initialValue: values.customerEmail ?? '', dropdownValue: [] },
      { field: 'type', title: 'Billing type', type: 'dropdown', required: true, initialValue: values.type ?? this.billingTypes[0], dropdownValue: dropdownValues(this.billingTypes) },
      { field: 'status', title: 'Status', type: 'dropdown', required: true, initialValue: values.status ?? 'Pending', dropdownValue: dropdownValues(this.billingStatuses) },
      { field: 'issueDate', title: 'Issue date', type: 'datepicker', required: true, initialValue: this.toDate(values.issueDate), dropdownValue: [] },
      { field: 'dueDate', title: 'Due date', type: 'datepicker', required: true, initialValue: this.toDate(values.dueDate), dropdownValue: [] },
      { field: 'paymentMethod', title: 'Payment method', type: 'dropdown', required: true, initialValue: values.paymentMethod ?? this.paymentMethods[0], dropdownValue: dropdownValues(this.paymentMethods) },
      { field: 'quantity', title: 'Quantity', type: 'number', required: true, min: 0.01, initialValue: values.quantity ?? 1, dropdownValue: [] },
      { field: 'unitPrice', title: 'Unit price (USD)', type: 'number', required: true, min: 0, initialValue: values.unitPrice ?? 0, dropdownValue: [] },
      { field: 'taxRate', title: 'Tax rate (%)', type: 'number', min: 0, max: 100, initialValue: values.taxRate ?? 0, dropdownValue: [] },
      { field: 'description', title: 'Description', type: 'textarea', required: true, maxLength: 500, initialValue: values.description ?? '', dropdownValue: [] },
    ];
  }

  private toDate(value: string | undefined): Date | null {
    if (!value) return null;
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private toDateString(value: Date | string): string {
    if (value instanceof Date) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return String(value).slice(0, 10);
  }

  private createBillNumber(): string {
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = date.getTime().toString().slice(-6);
    return `BILL-${datePart}-${timePart}`;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return entities[character];
    });
  }

  private formatMoney(value: number): string {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(value || 0));
  }
}
