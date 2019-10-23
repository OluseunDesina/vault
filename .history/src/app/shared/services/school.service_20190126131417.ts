import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appConfig } from '../../app.config';

@Injectable()
export class SchoolService {

  constructor(private http: HttpClient, public auth: AuthService, public cookieService: CookieService) { }

  getItems() {

  }

  public busListItems: any[] = []; public busTerminalListItems: any[] = []; public cardListItems: any[] = []; public schoolListItems: any[] = []; 
  public schoolTerminalListItems: any[] = []; public childListItems: any[] = []; public isUploading: boolean = false;

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('jwtTokenAccess'), }) }

  addBranch(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      name: registerInfo.name, unique_id: registerInfo.unique_id, school: registerInfo.school, address: registerInfo.address,
      description: registerInfo.description, latitude: registerInfo.latitude, longitude: registerInfo.longitude,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/addbranch/`, regInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(`Branch: ${regInfo.name}, created`);
    }, (err: any) => { this.auth.getGeneralErrorMessages(err); this.isUploading = false; });
  }

  getBusItems() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/bus/`); }
  getBusListItems() {
    return this.getBusItems().subscribe(
      (data) => { this.busListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getBusTerminalItems() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/busterminal/`); }
  getBusTerminalListItems(){
    return this.getBusTerminalItems().subscribe(
      (data) => { this.busTerminalListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getCardItems() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/card/`); }
  getCardListItems() {
    return this.getCardItems().subscribe(
      (data) => { this.cardListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getSchoolItems() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/school/`); }
  getSchoolListItems() {
    return this.getSchoolItems().subscribe(
      (data) => { this.schoolListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getSchoolTerminalItems() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/schoolterminal/`); }
  getSchoolTerminalListItems() {
    return this.getSchoolTerminalItems().subscribe(
      (data) => { this.schoolTerminalListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

}
