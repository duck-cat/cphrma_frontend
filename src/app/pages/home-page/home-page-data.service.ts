import { Injectable ,signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Subject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class HomeService {

    constructor(private http: HttpClient) {}
    
    public sendEvent=new Subject();
    public getEventButtonClick=this.sendEvent.asObservable();
    public eventSignal=signal<any>(null);
}
