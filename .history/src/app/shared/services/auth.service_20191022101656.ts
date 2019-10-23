import { Injectable } from '@angular/core';
import { HttpClient, HttpClientXsrfModule, HttpResponse, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import * as Rx from 'rxjs';

import { appConfig } from '../../app.config';
import { ERROR_MESSAGE_DICTIONARY } from '../error.message.config';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import { OrderService } from './order.service';

@Injectable()
export class AuthService {
  public companyListItems: any[]; public branchListItems: any[];
  public isLoaded: boolean;

  public errorMessages = ERROR_MESSAGE_DICTIONARY;
  public errorMessage: string = '';
  loginInvalid: boolean;
  public cardInvalid: boolean = false;

  public userProfileIsActive: boolean = false;

  //public isIdle: boolean = true;

  /*
    staff 3
    mgt 2
    sid 1
    security 4
    school 5
  */

  constructor(private http: HttpClient, public cookieService: CookieService, public oService: OrderService, private router: Router) { }

  private serviceUrl: string = 'auth/';
  private profileApiUrl: string = 'vault/profile/';
  public redirectUrl: string;

  private apiUrl: string = appConfig.apiUrl+this.serviceUrl;

  public currentUser: any;
  public currentUserID: number;
  public accessToken: string;

  public isUploading: boolean = false;

  public isAuthenticated: boolean = false;

  public userGroup = null;

  public username: string;
  public password: string;

  public dashboardAllowed: boolean; public profileAllowed: boolean; public createAccountantAllowed: boolean;
  public createManagerAllowed: boolean; public createStaffAllowed: boolean; public basketAllowed: boolean;
  public createSupervisorAllowed: boolean; public createTellerAllowed: boolean; public createCompanyAllowed: boolean;
  public createOperatorAllowed: boolean; public createCustomerServiceAllowed: boolean; public addCardAllowed: boolean; public addBranchAllowed: boolean;

  public statisticsAllowed: boolean; public inventoryListAllowed: boolean; public stockListAllowed: boolean; public foodListAllowed: boolean;
  public transactionListAllowed: boolean; public staffListAllowed: boolean; public paymentAllowed: boolean;
  public updateInventoryAllowed: boolean; public voidTransactionAllowed: boolean; public noRefundVoidTransactionAllowed: boolean;

  public addFoodAllowed: boolean; public addCategoryAllowed: boolean;
  public editFoodAllowed: boolean; public editCategoryAllowed: boolean; public superMerchantStaffListAllowed: boolean;
  public topUpAllowed: boolean; public topUpAllAllowed: boolean; public totalCostAllowed: boolean;
  public acitvateUserAllowed: boolean; public deacitvateUserAllowed: boolean; public createSuperMerchantAllowed: boolean;
  public companyTopupHistoryAllowed: boolean; public personalTopupHistoryAllowed: boolean; public massStaffTopupAllowed: boolean;
  public staffTopupAllowed: boolean; public staffTopupSettingsAllowed: boolean;
  public cardTransactionListAllowed: boolean; public personalTransactionListAllowed: boolean;
  public timer: any;
  public increaseTimer: any; public newProfileID: number; public currentInactiveUserID: number;
  public regInfo: any = {};
  public tokenAccess: any = ''; public tokenRefresh: any = ''; public checkCardErrorMessage: string = ''
  public resetPasswordID: number = null;

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('prjctTokenAccess'), }) }

register(registerInfo) {
  this.isUploading = true; console.log(`${appConfig.apiUrl}auth/staff/register/`);
  this.regInfo = {
    username: registerInfo.username,
    password: registerInfo.password,
    email: registerInfo.email,
    first_name: registerInfo.firstname,
    last_name: registerInfo.lastname,
    groups: [],
  };
  return this.http.post<any>(`${appConfig.apiUrl}auth/staff/register/`, this.regInfo).subscribe((res) => {
    this.newProfileID = res.id;
    alert(` Member: ${this.regInfo.first_name} ${this.regInfo.last_name} created successfully. Please check email for confirmation.`);
    this.isUploading = false;
    this.router.navigate(['complete-registration/']);
  },
    (err: any) => { console.log(err);
      this.getGeneralErrorMessages(err);
      this.isUploading = false;
    });
  }

  getGeneralErrorMessages(err) {
    switch (err.status) {
      case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; } case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); /*this.refreshJWT();*/ break; }
      case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; } case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
      case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; } case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
      case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
    }
  }

  getCreateUserErrorMessages(err) {
    switch (err.status) {
      case 400: { alert(ERROR_MESSAGE_DICTIONARY.createUserE400); break; } case 401: { alert(ERROR_MESSAGE_DICTIONARY.createUserE401); this.refreshJWT(); break; }
      case 403: { alert(ERROR_MESSAGE_DICTIONARY.createUserE403); break; } case 404: { alert(ERROR_MESSAGE_DICTIONARY.createUserE404); break; }
      case 415: { alert(ERROR_MESSAGE_DICTIONARY.createUserE415); break; } case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
      case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
    }
  }

  authenticateToken(id,token) {
    return this.http.post<any>(`${appConfig.apiUrl}auth/details/`, { user_id: id, token: token });
  }

  sendForgotPasswordRequest(email) {
    this.isUploading = true;
    return this.http.post<any>(`${appConfig.apiUrl}auth/reset/p/`, {email_address: email});
  }

  changePassword(oldPassword, newPassword) {
    this.isUploading = true;
    return this.http.put<any>(`${appConfig.apiUrl}auth/reset/after/`, { user_id: this.resetPasswordID, old_password: oldPassword, new_password: newPassword });
  }

  checkCard(cardID) {
    this.isUploading = true; this.cardInvalid = false;
    return this.http.post<any>(`${appConfig.apiUrl}vault/check/card/`, { card_id: cardID.toUpperCase() } ).subscribe((res) => {
      this.isUploading = false;
      this.cardInvalid = res[0].used_status;
      if (res[0].used_status === true) {
        this.checkCardErrorMessage = 'Card already used.';
      } else if (res[0].used_status === false) {
        this.checkCardErrorMessage = ERROR_MESSAGE_DICTIONARY.cardE400;
      }
    },
      (err: any) => {
        this.getGeneralErrorMessages(err);
        this.isUploading = false;
        this.cardInvalid = true;
      });
  }

  addCard(registerInfo) {
    let headers = new HttpHeaders(); let companyID = this.cookieService.get('user_id');
    headers = headers.set('Authorization', 'Bearer ' + this.cookieService.get('prjctTokenAccess'));
    this.isUploading = true;
    let regInfo = {
      card_id: registerInfo.card_id, used: false,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/bcard/`, regInfo, { headers: headers }).subscribe((res) => {
      this.isUploading = false;
      alert(`Card: ${regInfo.card_id} ${regInfo.card_id}.`);
    },
      (err: any) => {
        this.getGeneralErrorMessages(err);
        this.isUploading = false;
      });
  }

  createDriver(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      username: registerInfo.username, password: registerInfo.password,
      email: registerInfo.email, first_name: registerInfo.firstname,
      last_name: registerInfo.lastname, groups: [],
    };
    return this.http.post<any>(`${appConfig.apiUrl}auth/driver/register/`, regInfo).subscribe((res) => {
      this.isUploading = false;
      alert(`Driver: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  createGuardian(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      username: registerInfo.username, password: registerInfo.password,
      email: registerInfo.email, first_name: registerInfo.firstname,
      last_name: registerInfo.lastname, groups: [],
    };
    return this.http.post<any>(`${appConfig.apiUrl}auth/guardian/register/`, regInfo).subscribe((res) => {
      this.isUploading = false;
      alert(`Guardian: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  createSchool(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      username: registerInfo.username, password: registerInfo.password,
      email: registerInfo.email, first_name: registerInfo.firstname,
      last_name: registerInfo.lastname, groups: [],
    };
    return this.http.post<any>(`${appConfig.apiUrl}auth/school/register/`, regInfo).subscribe((res) => {
      this.isUploading = false;
      alert(`School User: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  createMinder(registerInfo) {
    this.isUploading = true;
    let regInfo = {
      username: registerInfo.username, password: registerInfo.password,
      email: registerInfo.email, first_name: registerInfo.firstname,
      last_name: registerInfo.lastname, groups: [],
    };
    return this.http.post<any>(`${appConfig.apiUrl}auth/minder/register/`, regInfo).subscribe((res) => {
      this.isUploading = false;
      alert(`Minder: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

    // createAccountant(registerInfo){
    //   this.isUploading = true;
    //   let regInfo = {
    //     username: registerInfo.username, password: registerInfo.password,
    //     email: registerInfo.email, first_name: registerInfo.firstname,
    //     last_name: registerInfo.lastname, groups: [],
    //   };
    //   return this.http.post<any>(`${appConfig.apiUrl}auth/accountant/register/`, regInfo).subscribe((res) => {
    //     this.isUploading = false;
    //     alert(`Accountant: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    // },
    // (err: any) => {
    //   this.getCreateUserErrorMessages(err);
    //     this.isUploading = false;
    //   });
    // }
  //   createCompany(registerInfo){
  //     this.isUploading = true;
  //     let regInfo = {
  //       username: registerInfo.companyUserName, password: registerInfo.password,
  //       email: registerInfo.hrEmail, first_name: 'Company',
  //       last_name: registerInfo.companyName, groups: [],
  //     };
  //     return this.http.post<any>(`${appConfig.apiUrl}auth/merchant/register/`, regInfo).subscribe((res) => {
  //       this.isUploading = false;
  //       alert(`Company: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
  //   },
  //   (err: any) => {
  //     this.getCreateUserErrorMessages(err);
  //     this.isUploading = false;
  //   });
  // }

  // createCustomerService(registerInfo) {
  //   this.isUploading = true;
  //   let regInfo = {
  //     username: registerInfo.username, password: registerInfo.password,
  //     email: registerInfo.email, first_name: registerInfo.firstname,
  //     last_name: registerInfo.lastname, groups: [],
  //   };
  //   return this.http.post<any>(`${appConfig.apiUrl}auth/custservice/register/`, regInfo).subscribe((res) => {
  //     this.isUploading = false;
  //     alert(`Customer Service Member: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
  //   },
  //     (err: any) => {
  //       this.getCreateUserErrorMessages(err);
  //       this.isUploading = false;
  //     });
  // }

    createManager(registerInfo){
      this.isUploading = true;
      let regInfo = {
        username: registerInfo.username, password: registerInfo.password,
        email: registerInfo.email, first_name: registerInfo.firstname,
        last_name: registerInfo.lastname, groups: [],
      };
      return this.http.post<any>(`${appConfig.apiUrl}auth/mgt/register/`, regInfo).subscribe((res) => {
        this.isUploading = false;
        alert(`Manager: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
    (err: any) => {
      this.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
    }

    // createOperator(registerInfo){
    //   this.isUploading = true;
    //   let regInfo = {
    //     username: registerInfo.username, password: registerInfo.password,
    //     email: registerInfo.email, first_name: registerInfo.firstname,
    //     last_name: registerInfo.lastname, groups: [],
    //   };
    //   return this.http.post<any>(`${appConfig.apiUrl}auth/operation/register/`, regInfo).subscribe((res) => {
    //     this.isUploading = false;
    //     alert(`Operator: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    // },
    // (err: any) => {
    //   this.getCreateUserErrorMessages(err);
    //   this.isUploading = false;
    // });
    // }

    createStaff(registerInfo, image){
      this.isUploading = true;
      this.regInfo = {
        username: registerInfo.username, password: registerInfo.password,
        email: registerInfo.email, first_name: registerInfo.firstname,
        last_name: registerInfo.lastname, groups: [],
      };
      let updateDetails = {
        image: image.split(',')[1], card_id: registerInfo.card_id,
        balance: 0.0, company: registerInfo.company,
        is_staff: '', sex: registerInfo.sex,
        phone: registerInfo.phone, profile_status: true,
        // last_modified: '',
        job_description: registerInfo.address,
        user: this.newProfileID, firstname: this.regInfo.first_name,
        lastname: this.regInfo.last_name, email: this.regInfo.email,
        address: registerInfo.address, location_user: registerInfo.address,
      };

      return this.http.post<any>(`${appConfig.apiUrl}auth/staff/register/`, this.regInfo).subscribe((res) => {
        this.http.put<any>(`${appConfig.apiUrl}vault/user/update/${res.id}/`, updateDetails).subscribe((res) => {
          this.isUploading = false;
          this.router.navigate(['login/']);
        },
          (err: any) => {
            this.getGeneralErrorMessages(err);
            this.isUploading = false;
          });
          updateDetails.lastname
        alert(`Staff Member: ${this.regInfo.first_name} ${this.regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
        this.isUploading = false;
        this.router.navigate(['complete-registration/']);
    },
    (err: any) => {
      this.getCreateUserErrorMessages(err);
      this.isUploading = false;
    });
  }

  updateStaff(registerInfo){
      let updateDetails = {
        card_id: registerInfo.card_id, balance: 0.0,
        branch: registerInfo.branch, is_staff: '',
        sex: registerInfo.sex, phone: registerInfo.phone,
        profile_status: true, job_description: registerInfo.address,
        user: this.newProfileID, firstname: this.regInfo.first_name,
        lastname: this.regInfo.last_name, email: this.regInfo.email,
        address: registerInfo.address, location_user: registerInfo.address,
      };
    return this.http.put<any>(`${appConfig.apiUrl}vault/user/update/${this.newProfileID}/`, updateDetails).subscribe((res) => {
      alert(`Staff Member: ${updateDetails.firstname} ${updateDetails.lastname} updated successfully. Please check your email for confirmation.`);
        this.isUploading = false; this.router.navigate(['login/']);
      },
        (err: any) => {
          this.getGeneralErrorMessages(err);
          this.isUploading = false;
        });
    }

  updateUser(registerInfo) {
    let updateDetails = {
      branch: registerInfo.branch, is_staff: '',
      sex: registerInfo.sex, phone: registerInfo.phone, last_modified: registerInfo.last_modified,
      profile_status: true, status: 'Not', job_description: registerInfo.job_description,
      user: this.newProfileID, firstname: this.regInfo.first_name,
      lastname: this.regInfo.last_name, email: this.regInfo.email,
      address: registerInfo.address, location_user: registerInfo.address,
    };
    return this.http.put<any>(`${appConfig.apiUrl}vault/user/update/${this.newProfileID}/`, updateDetails).subscribe((res) => {
      alert(`Staff Member: ${updateDetails.firstname} ${updateDetails.lastname} updated successfully. Please check your email for confirmation.`);
      this.isUploading = false; this.router.navigate(['login/']);
    },
      (err: any) => {
        this.getGeneralErrorMessages(err);
        this.isUploading = false;
      });
  }

  //   createSupervisor(registerInfo){
  //     this.isUploading = true;
  //     let regInfo = {
  //       username: registerInfo.username, password: registerInfo.password,
  //       email: registerInfo.email, first_name: registerInfo.firstname,
  //       last_name: registerInfo.lastname, groups: [],
  //     };
  //     return this.http.post<any>(`${appConfig.apiUrl}auth/supervisor/register/`, regInfo).subscribe((res) => {
  //       this.isUploading = false;
  //       alert(`Supervisor: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
  //   },
  //   (err: any) => {
  //     this.getCreateUserErrorMessages(err);
  //     this.isUploading = false;
  //   });
  // }
  // createSuperMerchant(registerInfo) {
  //   this.isUploading = true;
  //   let regInfo = {
  //     username: registerInfo.username, password: registerInfo.password,
  //     email: registerInfo.email, first_name: registerInfo.firstname,
  //     last_name: registerInfo.lastname, groups: [],
  //   };
  //   return this.http.post<any>(`${appConfig.apiUrl}auth/supermerchant/register/`, regInfo).subscribe((res) => {
  //     this.isUploading = false;
  //     alert(`Super Merchant: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
  //   },
  //     (err: any) => {
  //       this.getCreateUserErrorMessages(err);
  //       this.isUploading = false;
  //     });
  //   //console.log(user);
  // }
    // createTeller(registerInfo){
    //   this.isUploading = true;
    //   let regInfo = {
    //     username: registerInfo.username, password: registerInfo.password,
    //     email: registerInfo.email, first_name: registerInfo.firstname,
    //     last_name: registerInfo.lastname, groups: [],
    //   };
    //   return this.http.post<any>(appConfig.apiUrl+'auth/teller/register/', regInfo).subscribe((res) => {
    //     this.isUploading = false;
    //     alert(`Teller: ${regInfo.first_name} ${regInfo.last_name} created successfully. Please let user know that they should check their email for confirmation.`);
    // },
    // (err: any) => {
    //   this.getCreateUserErrorMessages(err);
    //   this.isUploading = false;
    // });
    // }

    getCompanyList(){
      return this.http.get<any[]>(`${appConfig.apiUrl}vault/company/`);
    }

    getCompanyListItems(){
      return this.getCompanyList().subscribe(
        (data) => { this.companyListItems = data; this.isLoaded = true; }, (err: any) => { }
      );
    }

  getBranchList() {
    return this.http.get<any[]>(`${appConfig.apiUrl}vault/branch/`);
  }
  getBranchListItems() {
    return this.getBranchList().subscribe(
      (data) => { this.branchListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { }
    );
  }

  async getJWT(username, password) {
    this.isUploading = true;
     return this.http.post<any>(appConfig.apiUrl + 'api/token/', { username: username, password: password }).subscribe((res) => {
      this.cookieService.set('prjctTokenRefresh', res.refresh); this.cookieService.set('prjctTokenAccess', res.access);
      window.localStorage.setItem('prjctTokenRefresh', res.refresh); window.localStorage.setItem('prjctTokenAccess', res.access);
      this.httpOptions.headers.set('Authorization', 'Bearer ' + res.access);
      this.isUploading = false;
    },
      (err: any) => {
        // if (err.status === 401 || err.status === 400) { this.isActiveCheck(username, password); }
        console.log(err);
        this.loginInvalid = true;
        switch (err.status) {
          case 400: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE401; break; } case 401: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE401; break; }
          case 403: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE403; break; } case 500: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.e500; break; }
          case 503: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.e503; break; }
        }
        this.isUploading = false;
      });
  }

  async refreshJWT() {
    let headers = new HttpHeaders(); headers = headers.set('Authorization', 'Bearer ' + this.cookieService.get('prjctTokenRefresh'));
    this.username = this.cookieService.get('username'); this.password = this.cookieService.get('password');
    return this.http.post<any>(appConfig.apiUrl + 'api/token/refresh/', { username: this.username, password: this.password }, { headers: headers }).subscribe((res) => {
      this.cookieService.delete('prjctTokenRefresh'); this.cookieService.delete('prjctTokenAccess');
      this.cookieService.set('prjctTokenRefresh', res.refresh); this.cookieService.set('prjctTokenAccess', res.access);
      this.httpOptions.headers.set('Authorization', 'Bearer ' + res.access); this.httpOptions.headers.set('Authorization', 'Bearer ' + res.access);
      this.isUploading = false; window.location.reload();
    },
      (err: any) => { window.location.reload(); this.cookieService.deleteAll(); this.router.navigate(['login/']); });
  }

    login(uname: string, pwd: string){
      this.cookieService.deleteAll(); this.getJWT(uname, pwd);
      let loginInfo = { username: uname, password: pwd };
      this.loginInvalid = false;
      this.isUploading = true; /*this.isActiveCheck(uname,pwd);*/
      return this.http.post<any>(this.apiUrl + 'login/', loginInfo)
      .do( async res => {
          if (res) {
            this.currentUser = res; this.oService.basket = [];
            await this.cookieService.set('user_id', (res.id));
            await this.cookieService.set('username', (res.username)); await this.cookieService.set('password', (pwd));
            await (this.username = uname); await (this.password = pwd);
            await this.cookieService.set('isAuth', 'true'); this.isAuthenticated = Boolean(this.cookieService.get('isAuth')); this.timedLogout();
            // if (res.groups[0] === 2) { await this.cookieService.set('isComp', 'true'); await this.cookieService.set('compName', res.last_name); }
            // else if (res.groups[0] !== 2) { await this.cookieService.set('isComp', 'false'); }
            // if (res.groups[0] === 10) { await this.cookieService.set('isCustomerService', 'true'); }
            // else if (res.groups[0] !== 10) { await this.cookieService.set('isCustomerService', 'false'); }
            // if (res.groups[0] === 4) { await this.cookieService.set('buccaTopupSettings', '[]'); } else if (res.groups[0] !== 4) { await this.cookieService.set('buccaTopupSettings', '[]'); }
            // if (res.groups[0] === 8) { await this.cookieService.set('isStaff', 'true'); await this.cookieService.set('buccaBasket', '[]'); }
            // else if (res.groups[0] !== 8) { await this.cookieService.set('isStaff', 'false'); await this.cookieService.set('buccaBasket', '[]'); }

            await this.cookieService.set('user_g', (res.groups[0]));

            this.userGroup = res.groups[0]; this.allowRoutes();
            this.router.navigate(['dashboard/']); this.isUploading = false;
          }
      }).catch(err => {
          this.loginInvalid = true;
          console.log(err);
        this.getGeneralErrorMessages(err);
          this.isUploading = false;
          return Observable.of(false);
        }).subscribe(resp => {
          if (!resp) { this.loginInvalid = true; } else {}
        });
  }

    public isActiveCheck(username, password): any {
      this.isUploading = true;
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', 'Bearer ' + this.cookieService.get('prjctTokenAccess'));
      return this.http.post<any>(`${appConfig.apiUrl}vault/complete/registration/`, { username: username }).subscribe((res) => {
        this.currentInactiveUserID = res[0].id; this.newProfileID = res[0].id; this.isUploading = false;
        if (res[0].active === false) { this.userProfileIsActive = false; }
        else { this.userProfileIsActive = true; }
        if (this.userProfileIsActive === false && res[0].groups === 8){ this.router.navigate(['complete-registration/']); }
      },
        (err: any) => {
          this.getGeneralErrorMessages(err);
          return false;
        });
    }

    timedLogout() {
      if (Boolean(this.cookieService.get('isAuth')) === true) {
        this.increaseTimer = window.onmousemove = () => { this.resetTimer(); }
        this.timer = setTimeout(() => { this.logout(); }, 600000);
      }
    }

    resetTimer() { this.endTimer(); this.timedLogout(); }
      //t = setTimeout(reload, 300000);  // time is in milliseconds (1000 is 1 second)
    endTimer() { if (Boolean(this.cookieService.get('isAuth')) === true) { clearTimeout(this.timer); } }

    logout() {
      let headers = new HttpHeaders(); headers = headers.set('Authorization', 'Bearer ' + this.cookieService.get('prjctTokenAccess'));
      clearTimeout(this.timer); this.cookieService.deleteAll(); this.oService.basket = [];
      return this.http.get<any>(`${this.apiUrl}logout/`)
      .subscribe((res) => { this.router.navigate(['initial/']); },
      (err: any) => { console.log(err) });
    }

    allowRoutes() {
      this.dashboardAllowed = false; this.profileAllowed = false; this.foodListAllowed = false; this.addCategoryAllowed = false;
      this.addFoodAllowed = false; this.editCategoryAllowed = false; this.editFoodAllowed = false; this.inventoryListAllowed = false;
      this.stockListAllowed = false; this.paymentAllowed = false; this.transactionListAllowed = false; this.statisticsAllowed = false;
      this.staffListAllowed = false; this.createAccountantAllowed = false; this.createManagerAllowed = false; this.createOperatorAllowed = false;
      this.createSupervisorAllowed = false; this.createTellerAllowed = false; this.createCompanyAllowed = false; this.createCustomerServiceAllowed = false;
      this.createStaffAllowed = false; this.updateInventoryAllowed = false; this.basketAllowed = false; this.superMerchantStaffListAllowed = false;
      this.voidTransactionAllowed = false; this.noRefundVoidTransactionAllowed = false; this.addCardAllowed = false; this.addBranchAllowed = false;
      this.topUpAllowed = false; this.topUpAllAllowed = false; this.acitvateUserAllowed = false; this.deacitvateUserAllowed = false; this.createSuperMerchantAllowed = false;
      this.companyTopupHistoryAllowed = false; this.personalTopupHistoryAllowed = false; this.totalCostAllowed = false; this.massStaffTopupAllowed = false;
      this.cardTransactionListAllowed = false; this.personalTransactionListAllowed = false; this.staffTopupAllowed = false; this.staffTopupSettingsAllowed = false;

      this.userGroup = this.cookieService.get('user_g');
        if (Number(this.userGroup) == 1) {//SID
          this.dashboardAllowed = true; this.profileAllowed = true; this.foodListAllowed = true; this.addCategoryAllowed = true;
          this.addFoodAllowed = true; this.editCategoryAllowed = true; this.editFoodAllowed = true; this.inventoryListAllowed = true;
          this.stockListAllowed = true; this.paymentAllowed = true; this.transactionListAllowed = true; this.statisticsAllowed = true;
          this.staffListAllowed = true; this.addCardAllowed = true; this.createAccountantAllowed = true; this.createManagerAllowed = true;
          this.createOperatorAllowed = true; this.createSupervisorAllowed = true; this.createTellerAllowed = true; this.createCompanyAllowed = true;
          this.createSuperMerchantAllowed = true; this.createStaffAllowed = true; this.updateInventoryAllowed = true; this.basketAllowed = true;
          this.voidTransactionAllowed = true; this.noRefundVoidTransactionAllowed = true; this.topUpAllowed = true; this.topUpAllAllowed = true;
          this.totalCostAllowed = true; this.staffTopupAllowed = true; this.massStaffTopupAllowed = true; this.staffTopupSettingsAllowed = true;
          this.createCustomerServiceAllowed = true; this.superMerchantStaffListAllowed = true; this.acitvateUserAllowed = true; this.addBranchAllowed = true;
        } else if (Number(this.userGroup) == 2) {//Company
          this.dashboardAllowed = true; this.foodListAllowed = true; this.inventoryListAllowed = true;
          this.stockListAllowed = true; this.staffListAllowed = true; this.transactionListAllowed = true;
          this.addCardAllowed = true; this.createSupervisorAllowed = true; this.createStaffAllowed = true;
          this.acitvateUserAllowed = true; this.totalCostAllowed = true;
        } else if (Number(this.userGroup) == 3) {//Supervisor
          this.dashboardAllowed = true; this.profileAllowed = true; this.inventoryListAllowed = true;
          this.stockListAllowed = true; this.voidTransactionAllowed = true;
        } else if (Number(this.userGroup) == 4) {//Accountant
          this.dashboardAllowed = true; this.profileAllowed = true;
          this.staffListAllowed = true; this.noRefundVoidTransactionAllowed = true;
          this.massStaffTopupAllowed = true; this.staffTopupAllowed = true;
          this.staffTopupSettingsAllowed = true;
        } else if (Number(this.userGroup) == 5) {//Teller
          this.dashboardAllowed = true; this.profileAllowed = true;
        } else if (Number(this.userGroup) == 6) {//Management
          this.dashboardAllowed = true; this.profileAllowed = true; this.transactionListAllowed = true; this.totalCostAllowed = true;
        } else if (Number(this.userGroup) == 7) {//Operations
          this.dashboardAllowed = true; this.profileAllowed = true; this.inventoryListAllowed = true;
          this.stockListAllowed = true; this.updateInventoryAllowed = true;
        } else if (Number(this.userGroup) == 8) {//Staff
          this.dashboardAllowed = true; this.profileAllowed = true; this.foodListAllowed = true; this.paymentAllowed = true;
          this.transactionListAllowed = true; this.basketAllowed = true; this.companyTopupHistoryAllowed = true; this.personalTopupHistoryAllowed = true;
          this.cardTransactionListAllowed = true; this.personalTransactionListAllowed = true;
        } else if (Number(this.userGroup) == 9) {//Super Merchant HR
          this.dashboardAllowed = true; this.profileAllowed = true; this.foodListAllowed = true; this.transactionListAllowed = true;
          this.inventoryListAllowed = true; this.stockListAllowed = true; this.createAccountantAllowed = true;
          this.createManagerAllowed = true; this.createOperatorAllowed = true; this.createSupervisorAllowed = true;
          this.createTellerAllowed = true; this.createCompanyAllowed = true; this.createCustomerServiceAllowed = true; this.superMerchantStaffListAllowed = true;
        } else if (Number(this.userGroup) == 10) {//Customer Service
          this.dashboardAllowed = true; this.profileAllowed = true; this.foodListAllowed = true; this.addCategoryAllowed = true;
          this.addFoodAllowed = true; this.editCategoryAllowed = true; this.editFoodAllowed = true;
        }
    }
}
