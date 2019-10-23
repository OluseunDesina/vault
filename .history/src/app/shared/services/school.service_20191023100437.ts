import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class SchoolService {

  private apiUrl = environment.apiUrl;

  private busListItems: any[] = [];
  private busListItemsUpdate = new Subject<any[]>();
  private busTerminalListItems: any[] = [];
  private busTerminalListItemsUpdate = new Subject<any[]>();
  private cardListItems: any[] = [];
  private cardListItemsUpdate = new Subject<any[]>();
  private schoolListItems: any[] = [];
  private schoolListItemsUpdate = new Subject<any[]>();
  private schoolTerminalListItems: any[] = [];
  private schoolTerminalListItemsUpdate = new Subject<any[]>();
  private childListItems: any[] = [];
  private isUploading = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    ) { }

  getItems() {

  }


  addBranch(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      name: registerInfo.name,
      unique_id: registerInfo.unique_id,
      school: registerInfo.school,
      address: registerInfo.address,
      description: registerInfo.description,
      latitude: registerInfo.latitude,
      longitude: registerInfo.longitude,
    };
    return this.http.post<any>(`${this.apiUrl}vault/addbranch/`, regInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(`Branch: ${regInfo.name}, created`);
    }, (err: any) => {
      // this.auth.getGeneralErrorMessages(err);
      this.isUploading = false;
    });
  }

  getBusItems() {
    return this.http.get<any[]>(`${this.apiUrl}vault/bus/`);
  }

  getBusListItems() {
    return this.getBusItems()
    .subscribe(
      (data) => {
        this.busListItems = data;
        this.busListItemsUpdate.next([...this.busListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getBusListItemsUpdateListener() {
    return this.busListItemsUpdate.asObservable();
  }

  getBusTerminalItems() {
    return this.http
    .get<any[]>(`${this.apiUrl}vault/busterminal/`);
  }

  getBusTerminalListItems(){
    return this.getBusTerminalItems()
    .subscribe(
      (data) => {
        this.busTerminalListItems = data;
        this.busTerminalListItemsUpdate.next([...this.busTerminalListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getBusTerminalListItemsUpdateListener() {
    return this.busTerminalListItemsUpdate.asObservable();
  }

  getCardItems() {
    return this.http
    .get<any[]>(`${this.apiUrl}vault/card/`);
  }

  getCardListItems() {
    return this.getCardItems()
    .subscribe(
      (data) => {
        this.cardListItems = data;
        this.cardListItemsUpdate.next([...this.cardListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getCardListItemsUpdateListener() {
    return this.cardListItemsUpdate.asObservable();
  }

  getSchoolItems() {
    return this.http
    .get<any[]>(`${this.apiUrl}vault/school/`);
  }

  getSchoolListItems() {
    return this.getSchoolItems()
    .subscribe(
      (data) => {
        this.schoolListItems = data;
        this.schoolListItemsUpdate.next([...this.schoolListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getSchoolListItemsUpdateListener() {
    return this.schoolListItemsUpdate.asObservable();
  }

  getSchoolTerminalItems() {
    return this.http
    .get<any[]>(`${this.apiUrl}vault/schoolterminal/`);
  }

  getSchoolTerminalListItems() {
    return this.getSchoolTerminalItems()
    .subscribe(
      (data) => {
        this.schoolTerminalListItems = data;
        this.schoolTerminalListItemsUpdate.next([...this.schoolTerminalListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getSchoolTerminalListItemsUpdateListener() {
    return this.schoolTerminalListItemsUpdate.asObservable();
  }

}
