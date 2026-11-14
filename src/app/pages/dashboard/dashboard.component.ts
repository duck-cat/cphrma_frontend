import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DonutComponent } from '../../shared/echarts/donut/donut.component';
import { BarChartComponent } from '../../shared/echarts/bar-chart/bar-chart.component';
import { PaiComponent } from '../../shared/echarts/pai/pai.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DonutComponent, BarChartComponent, PaiComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  errorMessage = '';

  kpis = {
    totalInventory: 0,
    expired: 0,
    expiringSoon: 0,
    totalSuppliers: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    outstandingAmount: 0,
  };

  readonly titleColumn = { shm_lookup: '', shm_mand: 1, shm_readonly: 1 };
  readonly titleColumnNoLegend = { shm_lookup: '', shm_mand: 1, shm_readonly: 0 };

  expiryColumn = [
    { ...this.titleColumn, columndisplay: 'Inventory Expiry Status', mappedfield: 'Inventory Expiry Status' },
    { shm_lookup: 'xaxis', mappedfield: 'name' },
    { shm_lookup: 'yaxis', mappedfield: 'value' },
  ];
  expiryData: Array<{ name: string; value: number }> = [];

  supplierColumn = [
    { ...this.titleColumnNoLegend, columndisplay: 'Supplier wise Medicine Quantity', mappedfield: 'Supplier wise Medicine Quantity' },
    { shm_lookup: 'xaxis', mappedfield: 'supplier' },
    { shm_lookup: 'yaxis', mappedfield: 'quantity', columndisplay: 'Quantity' },
  ];
  supplierData: Array<{ supplier: string; quantity: number }> = [];

  customerColumn = [
    { ...this.titleColumn, columndisplay: 'Customers by Category', mappedfield: 'Customers by Category' },
    { shm_lookup: 'xaxis', mappedfield: 'label' },
    { shm_lookup: 'yaxis', mappedfield: 'count' },
  ];
  customerData: Array<{ label: string; count: number }> = [];

  ordersColumn = [
    { ...this.titleColumnNoLegend, columndisplay: 'Orders by Status', mappedfield: 'Orders by Status' },
    { shm_lookup: 'xaxis', mappedfield: 'label' },
    { shm_lookup: 'yaxis', mappedfield: 'count', columndisplay: 'Orders' },
  ];
  ordersData: Array<{ label: string; count: number }> = [];

  billingColumn = [
    { ...this.titleColumn, columndisplay: 'Billing Status', mappedfield: 'Billing Status' },
    { shm_lookup: 'xaxis', mappedfield: 'label' },
    { shm_lookup: 'yaxis', mappedfield: 'count' },
  ];
  billingData: Array<{ label: string; count: number }> = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      expiry: this.dashboardService.getInventoryExpirySummary(),
      suppliers: this.dashboardService.getSupplierSalesSummary(8),
      customers: this.dashboardService.getCustomerSummary(),
      ordersBilling: this.dashboardService.getOrdersBillingSummary(),
    }).subscribe({
      next: ({ expiry, suppliers, customers, ordersBilling }) => {
        this.kpis.totalInventory = expiry.total;
        this.kpis.expired = expiry.expired;
        this.kpis.expiringSoon = expiry.expiringSoon;
        this.expiryData = [
          { name: 'Expired', value: expiry.expired },
          { name: 'Expiring soon (<=60d)', value: expiry.expiringSoon },
          { name: 'Safe', value: expiry.safe },
        ];

        this.kpis.totalSuppliers = suppliers.totalSuppliers;
        this.supplierData = suppliers.suppliers.map((s) => ({ supplier: s.supplier, quantity: s.quantity }));

        this.kpis.totalCustomers = customers.total;
        this.customerData = customers.byCategory.map((c) => ({ label: c.label, count: c.count }));

        this.kpis.totalOrders = ordersBilling.orders.total;
        this.kpis.totalRevenue = ordersBilling.billing.totalRevenue;
        this.kpis.outstandingAmount = ordersBilling.billing.outstandingAmount;
        this.ordersData = ordersBilling.orders.byStatus.map((o) => ({ label: o.label, count: o.count }));
        this.billingData = ordersBilling.billing.byStatus.map((b) => ({ label: b.label, count: b.count }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not load dashboard data. Check that the backend is running and try again.';
      },
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      value || 0,
    );
  }
}
