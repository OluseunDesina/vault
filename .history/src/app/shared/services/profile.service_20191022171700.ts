import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor(
    private http: HttpClient,
    public auth: AuthService,
    ) { }

  private serviceUrl = 'id/users/';
  private apiUrl = environment.apiUrl;
  public apiData: any;
  private apiDataUpdate = new Subject<any[]>();
  public apiStaffData: any;
  private apiStaffDataUpdate = new Subject<any[]>();
  public apiStaffPersonalBalance = 0;
  private apiStaffPersonalBalanceUpdate = new Subject<number>();

  public mostOrderedMeal: any = { food: 'Nothing', times_ordered: 0, };
  private mostOrderedMealUpdate = new Subject<any>();
  public leastOrderedMeal: any = { food: 'Nothing', times_ordered: 0, };
  private leastOrderedMealUpdate = new Subject<any>();


  public isLoaded = false;
  public isUploading = false;
  public isStaff = false;
  // public isComp = false;
  public staffDataIsLoaded = false;
  public currentProfileID = localStorage.getItem('user_id');
  public currentUsername = localStorage.getItem('username');
  private profileApiUrl = 'vault/users/';
  public profileUrl = `${this.apiUrl}${this.profileApiUrl}${this.currentProfileID}/`;

  public showProfileContents = true; public showEditProfile = false;

  getData() {
    this.currentProfileID = localStorage.getItem('user_id'); this.currentUsername = localStorage.getItem('username');
    this.profileUrl = `${this.apiUrl}${this.profileApiUrl}${this.currentProfileID}`;
    return this.http.get<any[]>(this.profileUrl);
  }
  getItems() {
    // this.isComp = JSON.parse(localStorage.getItem('isComp'));
    this.getData().subscribe(
      (data) => {
        console.log(data);
        this.apiData = data;
        this.apiDataUpdate.next([...this.apiData]);
        // if (this.apiData.is_staff.toLowerCase() === 'sta' ) {
        //   this.isStaff = true; this.getStaffDataItems();
        // } else { this.isStaff = false; }
        this.isLoaded = true;
    },
      (err) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getItemsUpdateListener() {
    return this.apiDataUpdate.asObservable();
  }

  getStaffData() {
    this.currentProfileID = localStorage.getItem('user_id');
    this.currentUsername = localStorage.getItem('username');
    this.profileUrl = `${this.apiUrl}vault/validate/each/staff/`;
    return this.http.post<any[]>(this.profileUrl, { card_id: this.apiData.card_id });
  }
  getStaffDataItems() {
    // this.isComp = JSON.parse(localStorage.getItem('isComp'));
    this.staffDataIsLoaded = false;
    this.getStaffPersonalBalance();
    this.getStaffData()
    .subscribe(
      (data) => {
        this.apiStaffData = data[0];
        this.apiStaffDataUpdate.next([...this.apiData]);
        this.staffDataIsLoaded = true;
       },
      (err) => { switch (err.status) { case 401: {  this.auth.refreshJWT(); break; } } }
    );
  }

  getStaffItemsUpdateListener() {
    return this.apiStaffDataUpdate.asObservable();
  }

  getStaffPersonalBalance() {
    // this.isComp = JSON.parse(localStorage.getItem('isComp'));
    const user_id = localStorage.getItem('user_id');
    this.http.post<any[]>(`${this.apiUrl}vault/personal/balance/`, { user_id })
    .subscribe(
      (data) => {
        if (data.length === 0) {
          this.apiStaffPersonalBalance = 0;
          this.apiStaffPersonalBalanceUpdate.next(this.apiStaffPersonalBalance);
          return this.apiStaffPersonalBalance;
        } else {
          this.apiStaffPersonalBalance = data[0].total_balance;
          this.apiStaffPersonalBalanceUpdate.next(this.apiStaffPersonalBalance);
          return this.apiStaffPersonalBalance;
        }
      },
      (err) => {switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
      );
    }

    getStaffPersonalBalanceUpdateListener() {
      return this.apiStaffPersonalBalanceUpdate.asObservable();
    }

    changePasswordII(oldPassword, newPassword) {
      this.isUploading = true;
      this.http.put<any>(`${this.apiUrl}auth/change/p/`, {  old_password: oldPassword, new_password: newPassword });
    }

    getMostOrderedMeal() {
      this.currentProfileID = localStorage.getItem('user_id');
      this.currentUsername = localStorage.getItem('username');
      this.http
      .post<any[]>(`${this.apiUrl}vault/favourite/meal/`, { user_id: this.currentProfileID })
      .subscribe(
        (data) => {
          if (data.length > 0) {
          this.mostOrderedMeal = data[0];
          return this.mostOrderedMeal;
        } else if (data.length < 1) {
          this.mostOrderedMeal = { food: 'Nothing', times_ordered: 0};
          return this.mostOrderedMeal;
        }
      },
      (err) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
      );
    }

    getMostOrderedMealUpdateListener() {
      return this.mostOrderedMealUpdate.asObservable();
    }

    getLeastOrderedMeal() {
      this.currentProfileID = localStorage.getItem('user_id');
      //this.savedUser.id
      this.currentUsername = localStorage.getItem('username');
      this.http.post<any[]>(`${this.apiUrl}vault/least/meal/`, { user_id: this.currentProfileID })
      .subscribe(
        (data) => {
          if (data.length > 0) {
          this.leastOrderedMeal = data[0];
          return this.leastOrderedMeal;
        } else if (data.length < 1) {
          this.leastOrderedMeal = { food: 'Nothing', times_ordered: 0, };
          return this.leastOrderedMeal;
        }
      },
      (err) => {
        switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getLeastOrderedMealUpdateListener() {
    return this.leastOrderedMealUpdate.asObservable();
  }

  editDetails(editForm, image) {
    this.isUploading = true;
    const updateDetails = {
      id: this.currentProfileID,
      firstname: editForm.firstname,
      lastname: editForm.lastname,
      image: image,
      user: this.currentProfileID,
      phone: editForm.phone,
    };
    console.log(updateDetails);
    return this.http.patch<any>(`${this.apiUrl}vault/users/${this.currentProfileID}/`, updateDetails)
    .subscribe((res) => {
      this.getItems();
      this.isUploading = false;
      alert('Profile successfully edited');
      window.location.reload();
    },
      (err: any) => { console.log(err);
        this.isUploading = false;
        // this.auth.getGeneralErrorMessages(err);
      });
  }

  viewProfileContents() {
    this.showEditProfile = false;
    this.showProfileContents = true;
  }

  viewEditProfile() {
    this.showProfileContents = false;
    this.showEditProfile = true;
   }


}
