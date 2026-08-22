import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {
 private url = `${environment.apiUrl}/approval`;
  constructor(private http: HttpClient) { }

   getAll(): Observable<any[]> {
      return this.http
        .get<{ status: string; data: any[] }>(this.url)
        .pipe(map(res => res.data.map((item, index) => ({ ...item, _rowIndex: index }))));
    }
  
    create(item:any): Observable<any> {
      return this.http.post(this.url, item);
    }
  
    update(index: number, item:any): Observable<any> {
      return this.http.put(`${this.url}/${index}`, item);
    }
  
    delete(index: number): Observable<any> {
      return this.http.delete(`${this.url}/${index}`);
    }
}
