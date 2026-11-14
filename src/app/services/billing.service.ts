import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BillingRecord {
  _rowIndex: number;
  billNumber: string;
  customerName: string;
  customerEmail: string;
  type: string;
  issueDate: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  subtotal: number;
  taxAmount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private readonly url = `${environment.apiUrl}/billing`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<BillingRecord[]> {
    return this.http
      .get<{ status: string; data: Omit<BillingRecord, '_rowIndex'>[] }>(this.url)
      .pipe(map((response) => response.data.map((item, index) => ({ ...item, _rowIndex: index }))));
  }

  create(item: Omit<BillingRecord, '_rowIndex'>): Observable<unknown> {
    return this.http.post(this.url, item);
  }

  update(index: number, item: Omit<BillingRecord, '_rowIndex'>): Observable<unknown> {
    return this.http.put(`${this.url}/${index}`, item);
  }

  delete(index: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${index}`);
  }
}
