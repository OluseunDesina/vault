import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appConfig } from '../../app.config';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient, public auth: AuthService, public cookieService: CookieService) { }

  private serviceUrl: string = 'id/users/';
  public apiData: any;
  public apiStaffData: any;

  public mostOrderedMeal: any = { food: 'Nothing', times_ordered: 0, };
  public leastOrderedMeal: any = { food: 'Nothing', times_ordered: 0, };


  public isLoaded: boolean = false; public isUploading: boolean = false;
  public isStaff: boolean = false; public isComp = false; public staffDataIsLoaded: boolean = false;
  public currentProfileID = this.cookieService.get('user_id'); public currentUsername = this.cookieService.get('username');
  private profileApiUrl: string = 'vault/users/'; public profileUrl = `${appConfig.apiUrl}${this.profileApiUrl}${this.currentProfileID}/`;

  public showProfileContents: boolean = true; public showEditProfile: boolean = false;
  public apiStaffPersonalBalance: number = 0;

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('prjctTokenAccess'), }) }
  getData(){
    this.currentProfileID = this.cookieService.get('user_id'); this.currentUsername = this.cookieService.get('username');
    this.profileUrl = `${appConfig.apiUrl}${this.profileApiUrl}${this.currentProfileID}`;
    return this.http.get<any[]>(this.profileUrl, this.httpOptions);
  }
  getItems(){
    // this.isComp = JSON.parse(this.cookieService.get('isComp'));
    return this.getData().subscribe(
      (data) => {this.apiData = data; console.log(data);
        // if (this.apiData.is_staff.toLowerCase() === 'sta' ) {
        //   this.isStaff = true; this.getStaffDataItems();
        // } else { this.isStaff = false; }
        this.isLoaded = true;
    },
      (err) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }   
    );
  }

  getStaffData() {
    this.currentProfileID = this.cookieService.get('user_id');this.currentUsername = this.cookieService.get('username');
    this.profileUrl = `${appConfig.apiUrl}vault/validate/each/staff/`;
    return this.http.post<any[]>(this.profileUrl, { card_id: this.apiData.card_id }, this.httpOptions);
  }
  getStaffDataItems() {
    this.isComp = JSON.parse(this.cookieService.get('isComp')); this.staffDataIsLoaded = false; this.getStaffPersonalBalance();
    return this.getStaffData().subscribe(
      (data) => { this.apiStaffData = data[0]; this.staffDataIsLoaded = true; },
      (err) => { switch (err.status) { case 401: {  this.auth.refreshJWT(); break; } } }
    );
  }
  
  getStaffPersonalBalance() {
    this.isComp = JSON.parse(this.cookieService.get('isComp')); this.currentProfileID = this.cookieService.get('user_id');
    return this.http.post<any[]>(`${appConfig.apiUrl}vault/personal/balance/`, { user_id: this.currentProfileID }, this.httpOptions).subscribe(
      (data) => { if (data === []) { this.apiStaffPersonalBalance = 0; } else { this.apiStaffPersonalBalance = data[0].total_balance; }},
      (err) => {switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  changePasswordII(oldPassword, newPassword) {
    this.isUploading = true;
    return this.http.put<any>(`${appConfig.apiUrl}auth/change/p/`, {  old_password: oldPassword, new_password: newPassword }, this.httpOptions);
  }

  getMostOrderedMeal() {
    this.currentProfileID = this.cookieService.get('user_id'); this.currentUsername = this.cookieService.get('username');
    return this.http.post<any[]>(`${appConfig.apiUrl}vault/favourite/meal/`, { user_id: this.currentProfileID }, this.httpOptions).subscribe(
      (data) => {        
        if (data.length > 0) { this.mostOrderedMeal = data[0]; } else if (data.length < 1) {
          this.mostOrderedMeal = { food: 'Nothing', times_ordered: 0,}
        }
      },
      (err) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getLeastOrderedMeal() {
    this.currentProfileID = this.cookieService.get('user_id'); //this.savedUser.id
    this.currentUsername = this.cookieService.get('username');
    return this.http.post<any[]>(`${appConfig.apiUrl}vault/least/meal/`, { user_id: this.currentProfileID }, this.httpOptions).subscribe(
      (data) => { if (data.length > 0) { this.leastOrderedMeal = data[0]; } else if (data.length < 1) {
          this.leastOrderedMeal = { food: 'Nothing', times_ordered: 0, }
        }
      },
      (err) => {
        switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  editDetails(editForm, image) {
    this.isUploading = true;
    let updateDetails = { id: this.currentProfileID, firstname: editForm.firstname, lastname: editForm.lastname,
      image: image, user: this.currentProfileID, phone: editForm.phone,
    };
    console.log(updateDetails); console.log(`${appConfig.apiUrl}vault/users/${this.currentProfileID}/`);
    return this.http.patch<any>(`${appConfig.apiUrl}vault/users/${this.currentProfileID}/`, updateDetails, this.httpOptions).subscribe((res) => {
      this.getItems(); this.isUploading = false; alert('Profile successfully edited'); window.location.reload();
    },
      (err: any) => { console.log(err);
        this.isUploading = false;
        this.auth.getGeneralErrorMessages(err);
      });
  }
  viewProfileContents() { this.showEditProfile = false; this.showProfileContents = true; }
  viewEditProfile() { this.showProfileContents = false; this.showEditProfile = true; }


}
