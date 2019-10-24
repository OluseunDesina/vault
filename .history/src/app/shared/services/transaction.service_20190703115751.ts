import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appConfig } from '../../app.config';
import { OrderService } from '../../shared/services/order.service';
import { ProfileService } from '../../shared/services/profile.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ERROR_MESSAGE_DICTIONARY } from 'src/app/shared/error.message.config';

@Injectable()
export class TransactionService {
  
  constructor(private http: HttpClient, private auth: AuthService, public cookieService: CookieService, public pService: ProfileService, public oService: OrderService) { }

  public grandTransactionTotal: number = 0; mealsPerCategory: number; todaysTransactionsOrderList: any;

  private listApiUrl: string = 'vault/transaction/';
  private listUrl = appConfig.apiUrl + this.listApiUrl;

  public listItems: any[] = []; public voidTransactionListItems: any[] = []; public noRefundVoidTransactionListItems: any[] = [];

  public totalCostItems: any[] = []; public totalCostSum: number = 0; public exportableTotalCostItems: any[];

  public transactionDetails: any;

  public categoryQuantities: number[] = []; public categoryQuantitiesB: number[] = []; public categoryNames: string[] = [];

  public grandTotal: number = 0; public transactionCount: number = 0 ; public todaysTransactionCount: number = 0;

  public todaysStartStockCount: number = 0; public todaysEndStockCount: number = 0;

  public today = ''; public currentMonthYear = '';
  

  public currentUserID = Number(this.cookieService.get('user_id'));
  public currentUsername = this.cookieService.get('username'); private transactionDetailApiUrl: string = 'vault/transaction/';
  public transactionDetailUrl = appConfig.apiUrl+this.transactionDetailApiUrl+this.currentUserID+'/';

  public isLoaded: boolean = false; public totalCostListIsLoaded: boolean = false; public topupHistoryLoaded: boolean = false; 
  public isUploading: boolean = false;

  public todaysTransactions: any[] = []; public selectedTransaction: any; public companyListItems: any[]; public userListItems: any[];

  public profileData: any;

  categories: any[]; categoryCount: number;

  public todaysTransactionFoodNames: any[] = [];
  public todaysTransactionFoodQuantities: any[] = [];

  public companyTopupHistory: any[] = [{ balance: 0, date: 'No Date Available' }]; public personalTopupHistory: any[] = [{ balance: 0, date: 'No Date Available' }];

  public uniquePaystackReference: string = '';

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('prjctTokenAccess'), }) }

  getDateFromString(utc) { return utc.split(' ')[0]; }; getTimeFromString(utc) { return utc.split('.')[0]; };

  create(createForm){      
    this.isUploading = true;
    let createInfo = {         
      time: createForm.time, subject: createForm.subject,
      duration: createForm.duration, date: createForm.date, type: createForm.type, location: createForm.location,
    };
    return this.http.post<any>(appConfig.apiUrl + 'vault/addtransaction/', createInfo, this.httpOptions).subscribe((res) => {
      this.oService.basket = [];
  },
  (err: any) => { });
  }

  resetCounters() {
    this.transactionCount = 0;
  }

  getItems(){    
    this.topupHistoryLoaded = false; let isStaff = JSON.parse(this.cookieService.get('isStaff'));
    this.getTodaysDate(); this.getProfileData();
    this.getFoodCategoryItems(); this.getTransactionListItems();
    if (isStaff) { this.getUserTransactionItems(this.getTodaysDate()); } else { this.getDaysTransactionItems(this.getTodaysDate()); }
    this.getDaysRevenue(); this.getCompanyListItems(); this.getUserListItems(); 
    this.getDaysStartStock(this.getTodaysDate()); this.getDaysEndStock(this.getTodaysDate());
  }

  getTodaysDate() {
    let todaysDate: Date = new Date(); let dd; let mm;
    if (Number(((todaysDate.getDate() + 1) + '').substring(1, 2)) > 0) { dd = todaysDate.getDate(); } else { dd = ('0' + (todaysDate.getDate())); }
    if (Number(((todaysDate.getMonth() + 1))) > 9) { mm = todaysDate.getMonth() + 1; } else { mm = ('0' + (todaysDate.getMonth() + 1)); } //January is 0!
    let yyyy = todaysDate.getFullYear(); this.today = (`${yyyy}${mm}${dd}`); return this.today;
  }
  getTodaysMonth() {
    let todaysDate: Date = new Date(); let dd; let mm;
    if (Number(((todaysDate.getDate() + 1) + '').substring(1, 2)) > 0) { dd = todaysDate.getDate(); } 
    else { dd = ('0' + (todaysDate.getDate())); }
    if (Number(((todaysDate.getMonth() + 1))) > 9) { mm = todaysDate.getMonth() + 1; } //January is 0!
    else { mm = ('0' + (todaysDate.getMonth() + 1)); }
    let yyyy = todaysDate.getFullYear(); this.today = (`${yyyy}${mm}`); return this.currentMonthYear;
  }

  getCompanyNameFromList(id) { try { return this.companyListItems.find(i => i.id === id).name; } catch {} }

  getCategoryNameFromList(id) { try { return this.categories.find(i => i.id === id).name; } catch { } }

  getUserNameFromList(id) {
    return this.userListItems.find(i => i.id === id).firstname;
  }

  getCompanyList(){
    return this.http.get<any[]>(appConfig.apiUrl + 'vault/company/', this.httpOptions);
  }
  getCompanyListItems(){
    return this.getCompanyList().subscribe((data) => {this.companyListItems = data; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getFoodCategories() { return this.http.get<any[]>(appConfig.apiUrl + 'vault/category/', this.httpOptions); }
  getFoodCategoryItems() {
    return this.getFoodCategories().subscribe(
      (data) => { this.categories = data; this.categoryCount = 0; for (let i = 0; i < this.categories.length; i++) { this.categoryCount++; } },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getMealCountPerCategory (id) {    
    return this.http.post<number[]>(`${appConfig.apiUrl}vault/find/category/`, { cat_id: id }, this.httpOptions).subscribe(
      async (data) => {
        this.mealsPerCategory = 0; for (let i = 0; i < data.length; i++) { this.mealsPerCategory++; }
        this.categoryQuantities.push(this.mealsPerCategory);
      },
      (err: any) => {
        switch (err.status) {
          case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; } case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); this.auth.refreshJWT(); break; }
          case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; } case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
          case 413: { alert(ERROR_MESSAGE_DICTIONARY.e413); break; } case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; }
          case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; } case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
        }
      }
    );
  }

  collectMealsPerCategory() {    
    this.categoryQuantities = []; for (let i = 0; i < this.categories.length; i++) { this.getMealCountPerCategory(this.categories[i].id);}
    return this.categoryQuantities;
  }

  collectNamesOfCategories() {
    this.categoryNames = []; for (let i = 0; i < this.categories.length; i++) { this.categoryNames.push(this.categories[i].name); }
    return this.categoryNames;
  }

  getProfile(){
    let currentProfileID = this.cookieService.get('user_id'); this.currentUsername = this.cookieService.get('username');
    let profileUrl = appConfig.apiUrl+'vault/profile/'+currentProfileID+'/';
    return this.http.get<any[]>(profileUrl, this.httpOptions);
  }
  getProfileData(){
    return this.getProfile().subscribe(
      (data) => { this.profileData = data;},
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getUserList(){ return this.http.get<any[]>(`${appConfig.apiUrl}vault/profile/`, this.httpOptions); }
  getUserListItems(){
    return this.getUserList().subscribe((data) => { this.userListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  

  getTransactionList() {
    return this.http.post<any[]>(`${appConfig.apiUrl}vault/all/transaction/`,[{}], this.httpOptions); }
  getTransactionListItems(){
    return this.getTransactionList().subscribe(
      (data) => {
        if (JSON.parse(this.cookieService.get('isStaff')) === true) {
          let cUserID = this.currentUserID; this.pService.getStaffDataItems(); this.grandTotal = 0; this.transactionCount = 0;
          data.filter((item) => {
            if (item.staff === this.pService.apiData.firstname) {
              this.listItems.push(item); this.transactionCount++; this.grandTotal += Number(item.total);
            }
          });
        } else if (JSON.parse(this.cookieService.get('isStaff')) === false) {
          this.listItems = data; this.grandTotal = 0; this.transactionCount = 0;
          for (let i = 0; i < this.listItems.length; i++) { this.transactionCount++; this.grandTotal += Number(this.listItems[i].total); }
        }
        this.isLoaded = true;
    },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }   
    );
  }

  getVoidTransactionList() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/void/`, this.httpOptions); }
  getVoidTransactionListItems() {
    this.isLoaded = false;
    return this.getVoidTransactionList().subscribe(
      (data) => { this.voidTransactionListItems = data; this.isLoaded = true; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getNoRefundVoidTransactionList() {
    return this.http.get<any[]>(appConfig.apiUrl + 'vault/norefundvoid/', this.httpOptions);
  }
  getNoRefundVoidTransactionListItems() {
    this.isLoaded = false;
    return this.getNoRefundVoidTransactionList().subscribe(
      (data) => { this.noRefundVoidTransactionListItems = data; this.isLoaded = true; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  countTransactionItems() {
    this.transactionCount = 0;
    for(let i = 0; i < this.listItems.length; i++) {
      this.transactionCount++;          
    }
    return this.transactionCount;
  }

  refreshApiUrl(){
    this.currentUserID = null; this.currentUsername = null;
    this.currentUserID = Number(this.cookieService.get('user_id')); this.currentUsername = this.cookieService.get('username');
    this.transactionDetailUrl = appConfig.apiUrl+this.transactionDetailApiUrl+this.currentUserID+'/';
  }

  getTransaction(){
    return this.http.get<any>(this.transactionDetailUrl);
  }
  getTransactionDetails(){    
    return this.getTransaction().subscribe(
      async (data) => { this.transactionDetails = data; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }    
    );
  }

  getCompanyTopupHistory() {
    this.currentUserID = Number(this.cookieService.get('user_id'));
    this.topupHistoryLoaded = false;
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/company/topup/history/', { user_id: this.currentUserID }, this.httpOptions).subscribe(
      async (data) => {
        //console.log(data);
        this.companyTopupHistory = data;
        console.log(this.companyTopupHistory);
        if (this.companyTopupHistory === []) {          
          this.companyTopupHistory = [{
            topup: 0,
            topup_date: 'No Data Available'
          }]          
        } 
        this.topupHistoryLoaded = true;
      },
      (err: any) => {
        this.topupHistoryLoaded = false;
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getPersonalTopupHistory() {
    this.currentUserID = Number(this.cookieService.get('user_id'));
    this.topupHistoryLoaded = false;
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/personal/top/history/', {user_id: this.currentUserID}, this.httpOptions).subscribe(
      async (data) => {
        console.log(data);
        this.personalTopupHistory = data;
        console.log(this.personalTopupHistory);
        if (this.personalTopupHistory === []) {
          this.personalTopupHistory = [{
            topup: 0,
            topup_date: 'No Data Available'
          }]
          console.log(this.personalTopupHistory);
        }
        this.topupHistoryLoaded = true;          
      },
      (err: any) => {
        this.topupHistoryLoaded = false;
        console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getUniquePaystackReference() {

    return this.http.post<any[]>(appConfig.apiUrl + 'vault/random/generator/', {}, this.httpOptions).subscribe(
      async (data) => {
        this.uniquePaystackReference = data[0].alphanumericserial;
      },
      (err: any) => {
        //console.log(err)
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  sendPaystackInfo() {

    return this.http.post<any[]>(appConfig.apiUrl + 'vault/random/generator/', {}, this.httpOptions).subscribe(
      async (data) => {
        this.uniquePaystackReference = data[0].alphanumericserial;
      },
      (err: any) => {
        //console.log(err)
        switch (err.status) {
          case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; }
          case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); this.auth.refreshJWT(); break; }
          case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; }
          case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
          case 413: { alert(ERROR_MESSAGE_DICTIONARY.e413); break; }
          case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; }
          case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
          case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
        }
      }
    );
  }

  getUserTransactions(date) {
    this.currentUserID = Number(this.cookieService.get('user_id'));
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/suc/staff/daytxn/', { user_id: this.currentUserID, check_date: date }, this.httpOptions);
  }
  getUserTransactionItems(date) {
    return this.getUserTransactions(date).subscribe(
      async (data) => {
        this.grandTotal = 0;
        // console.log('Hello? Is this Doge?');
        this.todaysTransactions = data;
        for (let i = 0; i < this.todaysTransactions.length; i++) {
          this.grandTotal += Number(this.todaysTransactions[i].total);
        }
        //console.log(this.grandTransactionTotal);
      },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getUserPersonalTransactions(date) {
    this.currentUserID = Number(this.cookieService.get('user_id'));
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/day/staff/txn/', { user_id: this.currentUserID, check_date: date }, this.httpOptions);
  }
  getUserPersonalTransactionItems(date) {
    return this.getUserTransactions(date).subscribe(
      async (data) => {
        this.grandTotal = 0;
        // console.log('Hello? Is this Doge?');
        this.todaysTransactions = data;
        for (let i = 0; i < this.todaysTransactions.length; i++) {
          this.grandTotal += Number(this.todaysTransactions[i].total);
        }
        //console.log(this.grandTransactionTotal);
      },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getUserCardTransactions(date) {
    this.currentUserID = Number(this.cookieService.get('user_id'));
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/day/staff/txn/', { user_id: this.currentUserID, check_date: date }, this.httpOptions);
  }
  getUserCardTransactionItems(date) {
    return this.getUserTransactions(date).subscribe(
      async (data) => {
        this.grandTotal = 0;
        // console.log('Hello? Is this Doge?');
        this.todaysTransactions = data;
        for (let i = 0; i < this.todaysTransactions.length; i++) {
          this.grandTotal += Number(this.todaysTransactions[i].total);
        }
        //console.log(this.grandTransactionTotal);
      },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getDaysTransactions(date) {
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/transact/eachday/', { check_date: date }, this.httpOptions);
  }
  getDaysTransactionItems(date) {
    let isComp = JSON.parse(this.cookieService.get('isComp'));
    let companyName = this.cookieService.get('compName');
    return this.getDaysTransactions(date).subscribe(
      async (data) => {
        // this.todaysTransactions = data;
        console.log(this.todaysTransactions);
        this.grandTotal = 0;
        if (data === []) {
          return 0;
        } else {
          
        }
        // console.log(isComp);
        if (isComp) {
          data.filter((item) => {
            if (item.company === companyName) {
              // console.log(item.company);
              this.todaysTransactions.push(item);
              this.grandTotal += Number(item.total);
            }
          });
          this.todaysTransactionCount = 0;
          //this.grandTransactionTotal = 0;
          this.todaysTransactionFoodNames = [];
          this.todaysTransactionFoodQuantities = [];
          for (let i = 0; i < this.todaysTransactions.length; i++) {
            this.todaysTransactionCount++;
            this.todaysTransactionsOrderList = this.todaysTransactions[i].order_list;
            for (let j = 0; j < this.todaysTransactionsOrderList.length; j++) {
              this.todaysTransactionFoodNames.push(this.todaysTransactionsOrderList[j].food_name);
              if (this.todaysTransactionFoodQuantities === []) {

                this.todaysTransactionFoodQuantities.push(this.todaysTransactionsOrderList[j].quantity);
              }
              else if (this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name) > -1) {
                this.todaysTransactionFoodQuantities[this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name)].quantity += this.todaysTransactionsOrderList[j].quantity;
              } else {
                this.todaysTransactionFoodQuantities.push(this.todaysTransactionsOrderList[j].quantity);
              }

            }
            //console.log(this.todaysTransactions[i].total);
            //this.grandTransactionTotal += Number(this.todaysTransactions[i].total);
            //console.log(this.grandTransactionTotal, 'in loop');
          }
        } else {
          this.todaysTransactions = data;
          this.todaysTransactionCount = 0;
          this.grandTotal = 0;
          //this.grandTransactionTotal = 0;
          this.todaysTransactionFoodNames = [];
          this.todaysTransactionFoodQuantities = [];
          for (let i = 0; i < this.todaysTransactions.length; i++) {
            this.grandTotal += Number(this.todaysTransactions[i].total);
          }
          // for (let i = 0; i < this.todaysTransactions.length; i++) {
          //   this.grandTotal += Number(this.listItems[i].total);
          //   this.todaysTransactionCount++;
          //   this.todaysTransactionsOrderList = this.todaysTransactions[i].order_list;
          //   for (let j = 0; j < this.todaysTransactionsOrderList.length; j++) {
          //     this.todaysTransactionFoodNames.push(this.todaysTransactionsOrderList[j].food_name);
          //     if (this.todaysTransactionFoodQuantities === []) {

          //       this.todaysTransactionFoodQuantities.push(this.todaysTransactionsOrderList[j].quantity);
          //     }
          //     else if (this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name) > -1) {
          //       // console.log(this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name));
          //       this.todaysTransactionFoodQuantities[this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name)].quantity += this.todaysTransactionsOrderList[j].quantity;
          //     } else {
          //       this.todaysTransactionFoodQuantities.push(this.todaysTransactionsOrderList[j].quantity);
          //     }
          //     // console.log(this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name));

          //   }
          //   //console.log(this.todaysTransactions[i].total);
          //   //this.grandTransactionTotal += Number(this.todaysTransactions[i].total);
          //   //console.log(this.grandTransactionTotal, 'in loop');
          // }
        }
        
        //console.log(this.grandTransactionTotal);
      },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getTotalCostData(date,company) {
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/daily/spentmonthly/staff/', { cmp_id: company, check_date: date }, this.httpOptions);
  }
  // getTotalCostItems() {
  //   this.getTotalCostData(this.getTodaysMonth).subscribe(
  //     async (data) => {
  //       this.totalCostItems = data;
  //       // console.log(this.todaysTransactions);
  //       if (data === []) {
  //         return 0;//??
  //       } else {

  //       }        
  //     },
  //     (err: any) => {
  //       //console.log(err);
  //       switch (err.status) {
  //         //case 400: { this.errorMessage = this.defaultErrorMessage; }
  //         case 401: { this.auth.refreshJWT(); break; }
  //       }
  //     }
  //   );
  // }

  getTotalCostSum(date, company) {
    // if (Number(this.cookieService.get('user_g')) === 2) {
    //   this.companyListItems.find();
    //   return this.http.post<any[]>(appConfig.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date }, this.httpOptions);
    // } else {
    //   return this.http.post<any[]>(appConfig.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date }, this.httpOptions);
    // }
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date }, this.httpOptions);
    
  }
  //vault/total/companyspent/daily/
  // getTotalCostSumItem() {
  //   this.getTotalCostSum(this.getTodaysMonth).subscribe(
  //     async (data) => {
  //       this.totalCostSum = 0;
  //       // console.log(this.todaysTransactions);
  //       if (data === []) {
  //         return 0;
  //       } else {
  //         this.totalCostSum = data[0].total;
  //       }
  //     },
  //     (err: any) => {
  //       //console.log(err);
  //       switch (err.status) {
  //         //case 400: { this.errorMessage = this.defaultErrorMessage; }
  //         case 401: { this.auth.refreshJWT(); break; }
  //       }
  //     }
  //   );
  // }

  getDaysRevenue() {
    this.http.post<any[]>(appConfig.apiUrl + 'vault/all/transaction/', {}, this.httpOptions).subscribe(
      async (data) => {
        this.grandTransactionTotal = 0;
        //console.log(data[0].total_sales);
        if (data = []) {
          return 0;  
        } else {
          this.grandTransactionTotal += Number(data[0].total_sales);
        }
        
        return this.grandTransactionTotal;
      },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getDaysStartStock(date) {
    //console.log(date);
    this.http.post<any[]>(appConfig.apiUrl + 'vault/added/stock/', { check_date: date }, this.httpOptions).subscribe(
      async (data) => {
        this.todaysStartStockCount = 0;
        ////console.log(data);
        for(let i = 0; i < data.length; i++) {
          this.todaysStartStockCount+=data[i].total_quantity;
          //console.log(this.todaysStartStockCount);
        }
        return this.todaysStartStockCount;
      },
      (err: any) => {
        //return 0;
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );;
  }

  getDaysEndStock(date) {
    //console.log(date);
    this.http.post<any[]>(appConfig.apiUrl + 'vault/remainder/daily/', { check_date: date }, this.httpOptions).subscribe(
      async (data) => {
        ////console.log(data);
        this.todaysEndStockCount = 0;
        for (let i = 0; i < data.length; i++) {
          this.todaysEndStockCount += data[i].total_remaining;
          //console.log(data[i].total_remaining);
        }
        return this.todaysEndStockCount;
      },
      (err: any) => {
        //return 0;
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );;
  }

  voidTransaction(voidForm) {
    let voidDate = this.getTodaysDate();
    this.currentUserID = Number(this.cookieService.get('user_id'));
    let voidInfo = {
      amount: 0,
      created_date: voidDate,
      transaction: voidForm.transactionID,
      // staff: voidForm.staffID,
      user_void: this.currentUserID,
    }
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/addvoid/', voidInfo, this.httpOptions).subscribe(
      async (data) => {
        alert('Transaction No.'+voidForm.transactionID+' Voided Successfully');
        //console.log(data);
      },
      (err: any) => {
        switch (err.status) {
          case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; }
          case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); this.auth.refreshJWT(); break; }
          case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; }
          case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
          case 413: { alert(ERROR_MESSAGE_DICTIONARY.e413); break; }
          case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; }
          case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
          case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
        }
      }
    );
  }

  noRefundVoidTransaction(voidForm) {
    let voidDate = this.getTodaysDate();
    this.currentUserID = Number(this.cookieService.get('user_id'));
    let voidInfo = {
      amount: 0,
      created_date: voidDate,
      transaction: voidForm.transactionID,
      // staff: voidForm.staffID,
      user_void: this.currentUserID,
    }
    return this.http.post<any[]>(appConfig.apiUrl + 'vault/addnoref/', voidInfo, this.httpOptions).subscribe(
      async (data) => {
        alert('Transaction No.' + voidForm.transactionID + ' Voided Successfully');
        //console.log(data);
      },
      (err: any) => {
        switch (err.status) {
          case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; }
          case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); this.auth.refreshJWT(); break; }
          case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; }
          case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
          case 413: { alert(ERROR_MESSAGE_DICTIONARY.e413); break; }
          case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; }
          case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
          case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
        }
      }
    );
  }

displayTransaction(transaction){
  //console.log(meeting);
  //this.transactionDetails.displayMeeting(meeting);
  this.selectedTransaction = transaction;
}



public purchase(  basket,basketTotal) {
  let todaysDate = new Date();
  console.log(this.profileData.company);
  let transaction = {
    user_id:  Number(this.cookieService.get('user_id')),
    date: '', //Removed due to design change request from stanley. Should be created by the Database on reception.
    time_created: '', //Removed due to design change request from stanley. Should be created by the Database on reception.
    total: basketTotal,
    order_name: basket,
    option: 'cd',
    status: '',
    company: 2,
    teller: 1,
    delivery_status: '',
    delivery_date: '' + this.getTodaysDate(),
  }
  return this.http.post<any>(appConfig.apiUrl + 'vault/transaction/', transaction, this.httpOptions).subscribe((res) => {
    console.log(res.status);
    this.http.get<any>(appConfig.apiUrl + 'vault/transaction/' + res.id + '/', this.httpOptions).subscribe((resp) => {
      // console.log('Create Successful');
      console.log(resp);
      // alert('Transaction Successful');
      this.pService.getStaffDataItems();
      console.log(resp.status);
      if (resp.status === 'Suc') {
        alert('Transaction Successful');
        this.oService.basket = [];
        this.cookieService.delete('buccaBasket');
        this.oService.countBasketItems();
      } else if (resp.status === 'Uns') {
        alert('Transaction Unsuccessful');
      } else if (resp.status === 'Ins') {
        alert('Insufficient Funds');
      } else if (resp.status === 'Nos') {
        alert('Not Enough Stock');
      }

    },
      (err: any) => {
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
        // alert('There was a problem with this Transaction');
      });

  },
  (err: any) => {
    switch (err.status) {
      case 400: { alert(ERROR_MESSAGE_DICTIONARY.e400); break; }
      case 401: { alert(ERROR_MESSAGE_DICTIONARY.e401); break; }
      case 403: { alert(ERROR_MESSAGE_DICTIONARY.e403); break; }
      case 404: { alert(ERROR_MESSAGE_DICTIONARY.e404); break; }
      case 415: { alert(ERROR_MESSAGE_DICTIONARY.e415); break; }
      case 500: { alert(ERROR_MESSAGE_DICTIONARY.e500); break; }
      case 503: { alert(ERROR_MESSAGE_DICTIONARY.e503); break; }
    }
  });
}

}
