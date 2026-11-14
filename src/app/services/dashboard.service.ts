import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryExpirySummary {
  expired: number;
  expiringSoon: number;
  safe: number;
  unknown: number;
  total: number;
  asOf: string;
}

export interface SupplierSalesSummary {
  suppliers: Array<{ supplier: string; quantity: number; value: number }>;
  totalSuppliers: number;
}

export interface CustomerSummary {
  total: number;
  byCategory: Array<{ label: string; count: number }>;
  byGender: Array<{ label: string; count: number }>;
}

export interface OrdersBillingSummary {
  orders: {
    total: number;
    byStatus: Array<{ label: string; count: number }>;
  };
  billing: {
    total: number;
    byStatus: Array<{ label: string; count: number }>;
    totalRevenue: number;
    outstandingAmount: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly url = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getInventoryExpirySummary(): Observable<InventoryExpirySummary> {
    return this.http
      .get<{ status: string; data: InventoryExpirySummary }>(`${this.url}/inventory-expiry-summary`)
      .pipe(map((response) => response.data));
  }

  getSupplierSalesSummary(limit = 10): Observable<SupplierSalesSummary> {
    return this.http
      .get<{ status: string; data: SupplierSalesSummary }>(`${this.url}/supplier-sales-summary?limit=${limit}`)
      .pipe(map((response) => response.data));
  }

  getCustomerSummary(): Observable<CustomerSummary> {
    return this.http
      .get<{ status: string; data: CustomerSummary }>(`${this.url}/customer-summary`)
      .pipe(map((response) => response.data));
  }

  getOrdersBillingSummary(): Observable<OrdersBillingSummary> {
    return this.http
      .get<{ status: string; data: OrdersBillingSummary }>(`${this.url}/orders-billing-summary`)
      .pipe(map((response) => response.data));
  }
}
