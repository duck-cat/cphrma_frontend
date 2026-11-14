import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryItem {
  _rowIndex: number;
  item_number: string;
  item_name: string;
  item_description: string;
  quantity: number;
  mfg_date: string;
  expiry_date: string;
  entry_date: string;
  location: string;
  supplier_name: string;
  supplier_details: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private url = `${environment.apiUrl}/inventory`;
 private commonurl = `${environment.apiUrl}/medicines`;
 private apiurl=`${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<InventoryItem[]> {
    return this.http
      .get<{ status: string; data: any[] }>(this.url)
      .pipe(map(res => res.data.map((item, index) => ({ ...item, _rowIndex: index }))));
  }

  create(item: Omit<InventoryItem, '_rowIndex'>): Observable<any> {
    return this.http.post(this.url, item);
  }

  update(index: number, item: Omit<InventoryItem, '_rowIndex'>): Observable<any> {
    return this.http.put(`${this.url}/${index}`, item);
  }

  delete(index: number): Observable<any> {
    return this.http.delete(`${this.url}/${index}`);
  }
  getAllMedicines(search=""): Observable<any> {
 return this.http.get(`${this.commonurl}/${search}`);
  }
  getSupplierInfo(){
     return this.http.get(`${this.apiurl}/supplierinfo`);
  }
}
