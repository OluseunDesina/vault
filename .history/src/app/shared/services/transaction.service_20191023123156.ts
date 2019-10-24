import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProfileService } from './profile.service';
import { OrderService } from './order.service';
import { environment } from 'src/environments/environment';
// import { ERROR_MESSAGE_DICTIONARY } from 'src/app/shared/error.message.config';

@Injectable()
export class TransactionService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private profileService: ProfileService,
    private orderService: OrderService
    ) { }

  private grandTransactionTotal = 0;
  private mealsPerCategory: number;
  private todaysTransactionsOrderList: any;

  private apiUrl = environment.apiUrl;
  private listApiUrl = 'vault/transaction/';
  private listUrl = this.apiUrl + this.listApiUrl;

  public listItems: any[] = [];
  public voidTransactionListItems: any[] = [];
  public noRefundVoidTransactionListItems: any[] = [];

  public totalCostItems: any[] = [];
  public totalCostSum = 0;
  public exportableTotalCostItems: any[];

  public transactionDetails: any;

  public categoryQuantities: number[] = [];
  public categoryQuantitiesB: number[] = [];
  public categoryNames: string[] = [];

  public grandTotal = 0;
  public transactionCount = 0 ;
  public todaysTransactionCount = 0;

  public todaysStartStockCount = 0;
  public todaysEndStockCount = 0;

  public today = ''; public currentMonthYear = '';


  public currentUserID = Number(localStorage.getItem('user_id'));
  public currentUsername = localStorage.getItem('username');
  private transactionDetailApiUrl = 'vault/transaction/';
  public transactionDetailUrl = this.apiUrl + this.transactionDetailApiUrl + this.currentUserID + '/';

  public isLoaded = false;
  public totalCostListIsLoaded = false;
  public topUpHistoryLoaded = false;
  public isUploading = false;

  public todaysTransactions: any[] = [];
  public selectedTransaction: any;
  public companyListItems: any[];
  public userListItems: any[];

  public profileData: any;

  private categories: any[];
  private categoryCount: number;

  public todaysTransactionFoodNames: any[] = [];
  public todaysTransactionFoodQuantities: any[] = [];

  public companyTopupHistory: any[] = [{ balance: 0, date: 'No Date Available' }];

  public personalTopupHistory: any[] = [{ balance: 0, date: 'No Date Available' }];

  public uniquePaystackReference = '';


  getDateFromString(utc) {
    return utc.split(' ')[0];
  }

  getTimeFromString(utc) {
    return utc.split('.')[0];
  }

  create(createForm) {
    this.isUploading = true;
    let createInfo = {
      time: createForm.time, subject: createForm.subject,
      duration: createForm.duration, date: createForm.date, type: createForm.type, location: createForm.location,
    };
    return this.http.post<any>(this.apiUrl + 'vault/addtransaction/', createInfo)
    .subscribe((res) => {
      // this.orderService.basket = [];
  },
  (err: any) => { });
  }

  resetCounters() {
    this.transactionCount = 0;
  }

  getItems() {
    this.topUpHistoryLoaded = false;
    let isStaff = JSON.parse(localStorage.getItem('isStaff'));
    this.getTodaysDate();
    this.getProfileData();
    this.getFoodCategoryItems();
    this.getTransactionListItems();
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
    if (Number(((todaysDate.getDate() + 1) + '').substring(1, 2)) > 0) { dd = todaysDate.getDate(); } else { dd = ('0' + (todaysDate.getDate())); }
    if (Number(((todaysDate.getMonth() + 1))) > 9) { mm = todaysDate.getMonth() + 1; } else { mm = ('0' + (todaysDate.getMonth() + 1)); }
    let yyyy = todaysDate.getFullYear(); this.today = (`${yyyy}${mm}`); return this.currentMonthYear;
  }

  getCompanyNameFromList(id) { try { return this.companyListItems.find(i => i.id === id).name; } catch {} }

  getCategoryNameFromList(id) { try { return this.categories.find(i => i.id === id).name; } catch { } }

  getUserNameFromList(id) {
    return this.userListItems.find(i => i.id === id).firstname;
  }

  getCompanyList() {
    return this.http.get<any[]>(this.apiUrl + 'vault/company/');
  }
  getCompanyListItems() {
    return this.getCompanyList().subscribe((data) => {this.companyListItems = data; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getFoodCategories() { return this.http.get<any[]>(this.apiUrl + 'vault/category/'); }
  getFoodCategoryItems() {
    return this.getFoodCategories().subscribe(
      (data) => { this.categories = data; this.categoryCount = 0; for (let i = 0; i < this.categories.length; i++) { this.categoryCount++; } },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getMealCountPerCategory (id) {
    return this.http.post<number[]>(`${this.apiUrl}vault/find/category/`, { cat_id: id }).subscribe(
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

  getProfile() {
    let currentProfileID = localStorage.getItem('user_id'); this.currentUsername = localStorage.getItem('username');
    let profileUrl = this.apiUrl+'vault/profile/'+currentProfileID+'/';
    return this.http.get<any[]>(profileUrl);
  }
  getProfileData() {
    return this.getProfile().subscribe(
      (data) => { this.profileData = data;},
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getUserList() { return this.http.get<any[]>(`${this.apiUrl}vault/profile/`); }
  getUserListItems() {
    return this.getUserList().subscribe((data) => { this.userListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }



  getTransactionList() {
    return this.http.post<any[]>(`${this.apiUrl}vault/all/transaction/`,[{}]); }
  getTransactionListItems() {
    return this.getTransactionList().subscribe(
      (data) => {
        if (JSON.parse(localStorage.getItem('isStaff')) === true) {
          let cUserID = this.currentUserID; this.profileService.getStaffDataItems(); this.grandTotal = 0; this.transactionCount = 0;
          data.filter((item) => {
            if (item.staff === this.profileService.apiData.firstname) {
              this.listItems.push(item); this.transactionCount++; this.grandTotal += Number(item.total);
            }
          });
        } else if (JSON.parse(localStorage.getItem('isStaff')) === false) {
          this.listItems = data; this.grandTotal = 0; this.transactionCount = 0;
          for (let i = 0; i < this.listItems.length; i++) { this.transactionCount++; this.grandTotal += Number(this.listItems[i].total); }
        }
        this.isLoaded = true;
    },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getVoidTransactionList() { return this.http.get<any[]>(`${this.apiUrl}vault/void/`); }
  getVoidTransactionListItems() {
    this.isLoaded = false;
    return this.getVoidTransactionList().subscribe(
      (data) => { this.voidTransactionListItems = data; this.isLoaded = true; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getNoRefundVoidTransactionList() {
    return this.http.get<any[]>(this.apiUrl + 'vault/norefundvoid/');
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

  refreshApiUrl() {
    this.currentUserID = null; this.currentUsername = null;
    this.currentUserID = Number(localStorage.getItem('user_id')); this.currentUsername = localStorage.getItem('username');
    this.transactionDetailUrl = this.apiUrl+this.transactionDetailApiUrl+this.currentUserID+'/';
  }

  getTransaction() {
    return this.http.get<any>(this.transactionDetailUrl);
  }
  getTransactionDetails() {
    return this.getTransaction().subscribe(
      async (data) => { this.transactionDetails = data; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getCompanyTopupHistory() {
    this.currentUserID = Number(localStorage.getItem('user_id'));
    this.topUpHistoryLoaded = false;
    return this.http.post<any[]>(this.apiUrl + 'vault/company/topup/history/', { user_id: this.currentUserID }).subscribe(
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
        this.topUpHistoryLoaded = true;
      },
      (err: any) => {
        this.topUpHistoryLoaded = false;
        //console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getPersonalTopupHistory() {
    this.currentUserID = Number(localStorage.getItem('user_id'));
    this.topUpHistoryLoaded = false;
    return this.http.post<any[]>(this.apiUrl + 'vault/personal/top/history/', {user_id: this.currentUserID}).subscribe(
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
        this.topUpHistoryLoaded = true;
      },
      (err: any) => {
        this.topUpHistoryLoaded = false;
        console.log(err);
        switch (err.status) {
          //case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  getUniquePaystackReference() {

    return this.http.post<any[]>(this.apiUrl + 'vault/random/generator/', {}).subscribe(
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

    return this.http.post<any[]>(this.apiUrl + 'vault/random/generator/', {}).subscribe(
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
    this.currentUserID = Number(localStorage.getItem('user_id'));
    return this.http.post<any[]>(this.apiUrl + 'vault/suc/staff/daytxn/', { user_id: this.currentUserID, check_date: date });
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
    this.currentUserID = Number(localStorage.getItem('user_id'));
    return this.http.post<any[]>(this.apiUrl + 'vault/day/staff/txn/', { user_id: this.currentUserID, check_date: date });
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
    this.currentUserID = Number(localStorage.getItem('user_id'));
    return this.http.post<any[]>(this.apiUrl + 'vault/day/staff/txn/', { user_id: this.currentUserID, check_date: date });
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
    return this.http.post<any[]>(this.apiUrl + 'vault/transact/eachday/', { check_date: date });
  }
  getDaysTransactionItems(date) {
    let isComp = JSON.parse(localStorage.getItem('isComp'));
    let companyName = localStorage.getItem('compName');
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
              } else if (this.todaysTransactionFoodNames.indexOf(this.todaysTransactionsOrderList[j].food_name) > -1) {
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
    return this.http.post<any[]>(this.apiUrl + 'vault/daily/spentmonthly/staff/', { cmp_id: company, check_date: date });
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
    // if (Number(localStorage.getItem('user_g')) === 2) {
    //   this.companyListItems.find();
    //   return this.http.post<any[]>(this.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date });
    // } else {
    //   return this.http.post<any[]>(this.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date });
    // }
    return this.http.post<any[]>(this.apiUrl + 'vault/total/spent/company/', { cmp_id: company, check_date: date });

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
    this.http.post<any[]>(this.apiUrl + 'vault/all/transaction/', {}).subscribe(
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
    this.http.post<any[]>(this.apiUrl + 'vault/added/stock/', { check_date: date }).subscribe(
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
    this.http.post<any[]>(this.apiUrl + 'vault/remainder/daily/', { check_date: date }).subscribe(
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
    this.currentUserID = Number(localStorage.getItem('user_id'));
    let voidInfo = {
      amount: 0,
      created_date: voidDate,
      transaction: voidForm.transactionID,
      // staff: voidForm.staffID,
      user_void: this.currentUserID,
    }
    return this.http.post<any[]>(this.apiUrl + 'vault/addvoid/', voidInfo).subscribe(
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
    this.currentUserID = Number(localStorage.getItem('user_id'));
    let voidInfo = {
      amount: 0,
      created_date: voidDate,
      transaction: voidForm.transactionID,
      // staff: voidForm.staffID,
      user_void: this.currentUserID,
    }
    return this.http.post<any[]>(this.apiUrl + 'vault/addnoref/', voidInfo).subscribe(
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

displayTransaction(transaction) {
  //console.log(meeting);
  //this.transactionDetails.displayMeeting(meeting);
  this.selectedTransaction = transaction;
}



public purchase(  basket,basketTotal) {
  let todaysDate = new Date();
  console.log(this.profileData.company);
  let transaction = {
    user_id:  Number(localStorage.getItem('user_id')),
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
  return this.http.post<any>(this.apiUrl + 'vault/transaction/', transaction).subscribe((res) => {
    console.log(res.status);
    this.http.get<any>(this.apiUrl + 'vault/transaction/' + res.id + '/').subscribe((resp) => {
      // console.log('Create Successful');
      console.log(resp);
      // alert('Transaction Successful');
      this.profileService.getStaffDataItems();
      console.log(resp.status);
      if (resp.status === 'Suc') {
        alert('Transaction Successful');
        this.orderService.basket = [];
        this.cookieService.delete('buccaBasket');
        this.orderService.countBasketItems();
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
