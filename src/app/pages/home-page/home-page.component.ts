import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { InventoryService } from '../../services/inventory.service';

interface NavMenuItem {
  label: string;
  icon: string;
  key: string;
  badge?: number;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    TagModule,
    ToastModule,
    InputNumberModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  selectedMenu = 'inventory';
  editSidebarVisible = false;
  selectedRow: any = null;
  isNewRecord = false;
  navOpen = false;
  searchText = '';
  statusFilter: string | null = null;
  categoryFilter: string | null = null;
  loading = false;

  menuItems: NavMenuItem[] = [
    { label: 'Inventory', icon: 'pi pi-box', key: 'inventory' },
    { label: 'Orders', icon: 'pi pi-shopping-cart', key: 'orders', badge: 6 },
    { label: 'Approvals', icon: 'pi pi-check-circle', key: 'approvals', badge: 3 },
    { label: 'Settings', icon: 'pi pi-cog', key: 'settings' },
  ];

  orderStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  priorityOptions = [
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  approvalStatusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Rejected', value: 'Rejected' },
  ];

  inventoryData: any[] = [];

  ordersData: any[] = [
    { id: 'ORD-001', customer: 'Acme Corp', product: 'Steel Rod 10mm', quantity: 100, date: '2026-07-15', status: 'Delivered' },
    { id: 'ORD-002', customer: 'TechBuild Ltd', product: 'Aluminum Sheet', quantity: 50, date: '2026-07-20', status: 'Processing' },
    { id: 'ORD-003', customer: 'Global Parts', product: 'Bearing 6205', quantity: 200, date: '2026-07-25', status: 'Pending' },
    { id: 'ORD-004', customer: 'FastFix Inc', product: 'Safety Gloves', quantity: 75, date: '2026-08-01', status: 'Shipped' },
    { id: 'ORD-005', customer: 'Acme Corp', product: 'Hydraulic Pump', quantity: 5, date: '2026-08-03', status: 'Processing' },
    { id: 'ORD-006', customer: 'MegaTools', product: 'Welding Wire', quantity: 30, date: '2026-08-04', status: 'Cancelled' },
  ];

  approvalsData: any[] = [
    { id: 'REQ-001', requestedBy: 'John Smith', type: 'Purchase Order', date: '2026-08-01', priority: 'High', status: 'Pending' },
    { id: 'REQ-002', requestedBy: 'Sara Lee', type: 'Vendor Onboarding', date: '2026-08-02', priority: 'Medium', status: 'Approved' },
    { id: 'REQ-003', requestedBy: 'Mike Chen', type: 'Budget Increase', date: '2026-08-03', priority: 'High', status: 'Pending' },
    { id: 'REQ-004', requestedBy: 'Linda Ray', type: 'Purchase Order', date: '2026-08-04', priority: 'Low', status: 'Rejected' },
    { id: 'REQ-005', requestedBy: 'Tom Davis', type: 'Asset Write-off', date: '2026-08-04', priority: 'Medium', status: 'Pending' },
  ];

  settingsData: any[] = [
    { id: 1, setting: 'Auto-approve threshold', value: '$5,000', category: 'Approvals', description: 'Orders below this value are auto-approved' },
    { id: 2, setting: 'Low stock alert', value: '50 units', category: 'Inventory', description: 'Alert when stock falls below this level' },
    { id: 3, setting: 'Critical stock alert', value: '10 units', category: 'Inventory', description: 'Critical alert when stock falls below this level' },
    { id: 4, setting: 'Order email notifications', value: 'Enabled', category: 'Notifications', description: 'Send email on order status change' },
    { id: 5, setting: 'Approval reminder interval', value: '24 hours', category: 'Approvals', description: 'Remind approvers after this interval' },
  ];

  private columnsMap: Record<string, Array<{ field: string; header: string }>> = {
    inventory: [
      { field: 'item_number', header: 'Item #' },
      { field: 'item_name', header: 'Name' },
      { field: 'quantity', header: 'Qty' },
      { field: 'price', header: 'Price' },
      { field: 'location', header: 'Location' },
      { field: 'expiry_date', header: 'Expiry' },
    ],
    orders: [
      { field: 'id', header: 'Order ID' },
      { field: 'customer', header: 'Customer' },
      { field: 'product', header: 'Product' },
      { field: 'quantity', header: 'Qty' },
      { field: 'date', header: 'Date' },
      { field: 'status', header: 'Status' },
    ],
    approvals: [
      { field: 'id', header: 'Request ID' },
      { field: 'requestedBy', header: 'Requested By' },
      { field: 'type', header: 'Type' },
      { field: 'date', header: 'Date' },
      { field: 'priority', header: 'Priority' },
      { field: 'status', header: 'Status' },
    ],
    settings: [
      { field: 'id', header: '#' },
      { field: 'setting', header: 'Setting' },
      { field: 'value', header: 'Value' },
      { field: 'category', header: 'Category' },
      { field: 'description', header: 'Description' },
    ],
  };

  private dataMap: Record<string, any[]> = {
    inventory: this.inventoryData,
    orders: this.ordersData,
    approvals: this.approvalsData,
    settings: this.settingsData,
  };

  get tableColumns() {
    return this.columnsMap[this.selectedMenu] || [];
  }

  get tableData() {
    let data = (this.dataMap[this.selectedMenu] || []).slice();

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      data = data.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }

    if (this.statusFilter) {
      data = data.filter(row => row.status === this.statusFilter);
    }

    if (this.categoryFilter) {
      const field = this.selectedMenu === 'approvals' ? 'type'
        : this.selectedMenu === 'inventory' ? 'location'
        : 'category';
      data = data.filter(row => row[field] === this.categoryFilter);
    }

    return data;
  }

  get currentStatusOptions() {
    if (this.selectedMenu === 'settings' || this.selectedMenu === 'inventory') return [];
    const src = this.dataMap[this.selectedMenu] || [];
    return [...new Set(src.map((r: any) => r.status))].map(s => ({ label: s, value: s }));
  }

  get currentCategoryOptions() {
    if (this.selectedMenu === 'inventory') {
      return [...new Set(this.inventoryData.map(r => r.location).filter(Boolean))].map(l => ({ label: l, value: l }));
    }
    if (this.selectedMenu === 'approvals') {
      return [...new Set(this.approvalsData.map(r => r.type))].map(t => ({ label: t, value: t }));
    }
    return [];
  }

  get currentMenuLabel() {
    return this.menuItems.find(m => m.key === this.selectedMenu)?.label ?? '';
  }

  get inventoryBadge() {
    return this.inventoryData.length || null;
  }

  constructor(
    private messageService: MessageService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventoryData = data;
        this.dataMap['inventory'] = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load inventory. Is the backend running?', life: 5000 });
      }
    });
  }

  selectMenu(key: string): void {
    this.selectedMenu = key;
    this.clearFilters();
    this.navOpen = false;
  }

  toggleNav(): void {
    this.navOpen = !this.navOpen;
  }

  clearFilters(): void {
    this.searchText = '';
    this.statusFilter = null;
    this.categoryFilter = null;
  }

  openEdit(row: any): void {
    this.selectedRow = { ...row };
    this.isNewRecord = false;
    this.editSidebarVisible = true;
  }

  openAddNew(): void {
    if (this.selectedMenu === 'inventory') {
      this.selectedRow = {
        item_number: '',
        item_name: '',
        item_description: '',
        quantity: 0,
        mfg_date: '',
        expiry_date: '',
        entry_date: new Date().toISOString().split('T')[0],
        location: '',
        supplier_name: '',
        supplier_details: '',
        price: 0,
        _rowIndex: -1,
      };
      this.isNewRecord = true;
      this.editSidebarVisible = true;
    }
  }

  saveRow(): void {
    if (this.selectedMenu === 'inventory') {
      const { _rowIndex, ...payload } = this.selectedRow;
      if (this.isNewRecord) {
        this.inventoryService.create(payload).subscribe({
          next: () => {
            this.editSidebarVisible = false;
            this.messageService.add({ severity: 'success', summary: 'Created', detail: 'Inventory item added', life: 3000 });
            this.loadInventory();
          },
          error: (err) => {
            const detail = err?.error?.missing_fields
              ? `Missing: ${err.error.missing_fields.join(', ')}`
              : 'Failed to create record';
            this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
          }
        });
      } else {
        this.inventoryService.update(_rowIndex, payload).subscribe({
          next: () => {
            const idx = this.inventoryData.findIndex(r => r._rowIndex === _rowIndex);
            if (idx > -1) this.inventoryData[idx] = { ...this.selectedRow };
            this.editSidebarVisible = false;
            this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Record updated successfully', life: 3000 });
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update record', life: 5000 });
          }
        });
      }
    } else {
      const dataset = this.dataMap[this.selectedMenu];
      const idx = dataset.findIndex((r: any) => r.id === this.selectedRow.id);
      if (idx > -1) dataset[idx] = { ...this.selectedRow };
      this.editSidebarVisible = false;
      this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Record updated successfully', life: 3000 });
    }
  }

  deleteRow(): void {
    if (this.selectedMenu !== 'inventory') return;
    const index = this.selectedRow._rowIndex;
    this.inventoryService.delete(index).subscribe({
      next: () => {
        this.editSidebarVisible = false;
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Inventory item removed', life: 3000 });
        this.loadInventory();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record', life: 5000 });
      }
    });
  }

  statusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    const map: Record<string, 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast'> = {
      'In Stock': 'success', 'Low Stock': 'warning', 'Critical': 'danger', 'Out of Stock': 'danger',
      'Delivered': 'success', 'Shipped': 'info', 'Processing': 'warning', 'Pending': 'warning',
      'Approved': 'success', 'Rejected': 'danger', 'Cancelled': 'danger',
      'Enabled': 'success', 'Disabled': 'secondary',
      'High': 'danger', 'Medium': 'warning', 'Low': 'success',
    };
    return map[status] ?? 'info';
  }
}
