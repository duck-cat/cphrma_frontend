import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CustomerRecord {
  _rowIndex: number;
  member_id: string;
  name: string;
  gender: string;
  mobile: string;
  email: string;
  dob: string;
  category: string;
  d_name: string;
  address: string;
}

export type CustomerPayload = Omit<CustomerRecord, '_rowIndex'>;

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly url = `${environment.apiUrl}/customer`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CustomerRecord[]> {
    return this.http
      .get<{ status: string; data: CustomerPayload[] }>(this.url)
      .pipe(map((response) => response.data.map((item, index) => ({ ...item, _rowIndex: index }))));
  }

  create(customer: CustomerPayload): Observable<unknown> {
    return this.http.post(this.url, customer);
  }

  update(memberId: string, customer: CustomerPayload): Observable<unknown> {
    return this.http.put(`${this.url}/${encodeURIComponent(memberId)}`, customer);
  }

  delete(memberId: string): Observable<unknown> {
    return this.http.delete(`${this.url}/${encodeURIComponent(memberId)}`);
  }
}
