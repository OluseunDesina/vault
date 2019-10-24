import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    ) { }

  private appUrl = environment.apiUrl;

  private serviceUrl = 'vault/users/';
  private apiUrl = this.appUrl + this.serviceUrl;
  private apiItems: any[];
  private apiProfile: any;
  private apiStaffItems: any[] = [];
  private apiStaffStatusItems: any[];
  private superMerchantStaffItems: any[];
  private topupSettings: any[] = [];
  private companyListItems: any[];
  private isLoaded = false;
  private staffListIsLoaded = false;
  private cardID = '';
  private guardianListItems: any[] = [];
  private guardianListItemsUpdate = new Subject<any[]>();
  private driverListItems: any[] = [];
  private driverListItemsUpdate = new Subject<any[]>();
  private minderListItems: any[] = [];
  private minderListItemsUpdate = new Subject<any[]>();

  private staffFilterTerm = '';
  private selectedMeal: any;
  private selectedStaffMember: any;
  private isComp = false;
  private currentUserID = Number(localStorage.getItem('user_id'));
  private currentProfileID = localStorage.getItem('user_id');
  private currentUsername = localStorage.getItem('username');
  private staffCount = 0;
  private userCount = 0;
  private isUploading = false;



  private selectedAgent: any = {};
  private agentSelected = false;
  private agentList: any[] = [];
  private agentTasks: any[] = [];
  private agentTransactions: any[] = [];
  private agentVisitedLocations: any[] = [];

  private mockAgentList: any[] = [
    {
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      email: 'johndoe@email.com',
      image: 'assets/img/avatars/john-doe.jpg',
      address: '5 Doe Avenue',
      phone: '90192827182',
      sex: 'Male',
      tasks: [
        {
          id: 1,
          name: 'Meeting With CEO',
          location_name: 'Guarantee Trust Bank - Victoria Island',
          description: 'Meet with the Noah Okunnu to discuss project developments',
          coordinates: {
            lat: 6.435656634639082,
            lng: 3.424344062805176
          }
        },
        {
          id: 2,
          name: 'Meeting With Marketing',
          location_name: 'Zenith Bank - Victoria Island Head Office',
          description: 'Meeti With Taiwo Bisola to discuss advertising campaigns',
          coordinates: {
            lat: 6.430752446659954,
            lng: 3.43546986579895
          }
        },
        {
          id: 3,
          name: 'Proposal to CFO',
          location_name: 'Access Bank - Awolowo 2',
          description: 'Meet with the Fatima Omar to propose a new project',
          coordinates: {
            lat: 6.442637421864779,
            lng: 3.416696673058823
          }
        },
      ]
    },
    {
      id: 2,
      firstname: 'Jason',
      lastname: 'Dough',
      email: 'jasondoe@email.com',
      image: 'assets/img/avatars/john-doe-2.jpg',
      address: '10 Doe Avenue',
      phone: '02789411344',
      sex: 'Male',
      tasks: [
        {
          id: 1,
          name: 'Meeting with CFO',
          location_name: 'Diamond Bank',
          description: 'Meet with the James Eneh',
          coordinates: {
            lat: 6.442063991497767,
            lng: 3.4159648418426514
          }
        },
        {
          id: 2,
          name: 'Meeting with Marketing',
          location_name: 'Access Bank - Awolowo 2',
          description: 'Meet with Chioma Mbanigo',
          coordinates: {
            lat: 6.442637421864779,
            lng: 3.416696673058823
          }
        },
        {
          id: 3,
          name: 'Meet with CEO',
          location_name: 'Zenith Bank - Victoria Island Head Office',
          description: 'Meet with Adeola Fafunwa to work on the latest project.',
          coordinates: {
            lat: 6.430752446659954,
            lng: 3.43546986579895
          }
        },
      ]
    },
  ];

  private mockStaff: any[] = [
    {
      id: 1,
      firstname: 'Farouk',
      lastname: 'Oyofo',
      email: 'farouk.oyofo@gmail.com',
      company: 'SecureID',
      sex: 'Male',
      phone: '01937297291',
      balance: '0',
      card_id: 'XYZ721IDSLK'
    }
  ];



  getDriverItems() {
    return this.http.get<any[]>(`${this.appUrl}vault/driver/`);
  }

  getDriverListItems() {
    return this.getDriverItems()
    .subscribe(
      (data) => {
        this.driverListItems = data;
        this.driverListItemsUpdate.next([...this.driverListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getDriverListItemsUpdateListener() {
    return this.driverListItemsUpdate.asObservable();
  }

  getGuardianItems() {
    return this.http.get<any[]>(`${this.appUrl}vault/guardian/`);
  }

  getGuardianListItems() {
    return this.getMinderItems().subscribe(
      (data) => {
        this.guardianListItems = data;
        this.guardianListItemsUpdate.next([...this.guardianListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getGuardianListItemsUpdateListener() {
    return this.guardianListItemsUpdate.asObservable();
  }

  getMinderItems() {
    return this.http.get<any[]>(`${this.appUrl}vault/minder/`);
  }

  getMinderListItems() {
    return this.getMinderItems()
    .subscribe(
      (data) => {
        this.minderListItems = data;
        this.minderListItemsUpdate.next([...this.minderListItems]);
      }, (err: any) => {
        switch (err.status) {
          case 401: { this.auth.refreshJWT(); break; }
        }
      });
  }

  getMinderListItemsUpdateListener() {
    return this.minderListItemsUpdate.asObservable();
  }

  ////////////
  getCompanyNameFromList(id) {
    try {
      return this.companyListItems.find(i => i.id === id).name;
    }
    catch { }
  }

  filterBy(property) {
    if (property === 'all') {
      this.staffFilterTerm = '';
    } else {
      this.staffFilterTerm = property;
    }
  }

  addFunds(amount, userID): any {
    this.isUploading = true;
    return this.http
    .post(`${this.appUrl}vault/topup/staff/`, { user_id: userID, amount: amount })
    .subscribe(
      (res) => {
        this.isUploading = false;
        this.getStaffItems();
        alert('Balance was successfully updated.'); },
      (err: any) => {
        this.isUploading = false;
        // this.auth.getGeneralErrorMessages(err);
      }
    );
  }

  getTopupSettings(): any {
    this.isUploading = true;
    return this.http.get(this.appUrl + 'vault/bulktopup/').subscribe(
      (data) => {
        this.isUploading = false;
        // this.topupSettings = [];
        // this.topupSettings = data;
        // alert('Balance was successfully updated.');
        // this.selectedStaffMember.balance = newFunds;
        //// console.log(res);
      },
      (err: any) => {
        this.isUploading = false;
        // console.log(err);
        switch (err.status) {
          // case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  setTopupSettings(amount, userID): any {
    const topupSetting = {
      amount_added: amount,
      user_id: userID,
    };

    try {
      if (this.topupSettings.find(i => i.user_id === topupSetting.user_id)) {
        // console.log('condition satisfied');
        this.topupSettings.find(i => i.amount_added === topupSetting.amount_added).amount_added = topupSetting.amount_added;
        // this.topupSettings.find(i => i.food_name === topupSetting.food_name).total += topupSetting.total;
      } else {
        this.topupSettings.push(topupSetting);
      }
      // for (let i = 0; i < this.topupSettings.length; i++) {
      //   this.topupSettingsCount++;
      //   this.topupSettingsTotal += this.topupSettings[i].total
      // }
      console.log(this.topupSettings);
      localStorage.removeItem('buccaTopupSettings');
      localStorage.setItem('buccaTopupSettings', JSON.stringify(this.topupSettings));
      // alert('' + topupSetting.quantity + ' unit(s) of ' + topupSetting.food_name + ' added to basket.');
      // addToCartForm.reset();
    } catch (err) {
      // console.log(err);
    }

    this.topupSettings.push(topupSetting);
  }

  sendTopupSettings(amount, userID): any {
    this.isUploading = true;
    return this.http.post(`${this.appUrl}vault/bulktopup/`, this.topupSettings).subscribe(
      (data) => {
        this.isUploading = false;
        // console.log(res);
        this.getStaffItems();
        alert('Balance was successfully updated.');
        // this.selectedStaffMember.balance = newFunds;
        //// console.log(res);
      },
      (err: any) => {
        this.isUploading = false;
        // console.log(err);
        switch (err.status) {
          // case 400: { this.errorMessage = this.defaultErrorMessage; }
          case 401: { this.auth.refreshJWT(); break; }
        }
      }
    );
  }

  addPaystackFunds(amount, paystackRef): any {
    this.currentUserID = Number(localStorage.getItem('user_id'));
    return this.http.post(`${this.appUrl}vault/topup/personal/`, { user_id: this.currentUserID, amount: amount, ref_no: paystackRef })
    .subscribe(
      (res) => { },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getUserListData() { return this.http.get<any[]>(this.apiUrl); }

  getUserListItems() {
    this.isComp = JSON.parse(localStorage.getItem('isComp')); this.currentUserID = Number(localStorage.getItem('user_id'));
    this.currentProfileID = localStorage.getItem('user_id'); this.currentUsername = localStorage.getItem('username');
    this.isLoaded = false;
    return this.getUserListData().subscribe(
      (data) => {
        this.apiItems = data; this.userCount = 0;
        for (let i = 0; i < this.apiItems.length; i++) { this.userCount++; }
        this.isLoaded = true;
      },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  getStaffData() {
    return this.http.get<any[]>(`${this.appUrl}vault/staff/`);
  }

  getStaffItems() {
    this.isComp = JSON.parse(localStorage.getItem('isComp')); this.currentUserID = Number(localStorage.getItem('user_id'));
    let companyID = Number(localStorage.getItem('user_id')); this.isLoaded = false; this.staffListIsLoaded = false;
    return this.getStaffData().subscribe(
      (data) => {
      if(this.isComp) {
        data.filter((item) => { if (Number(item.company_name) === companyID) { this.apiStaffItems.push(item); } });
        this.staffListIsLoaded = true;
      } else { this.apiStaffItems = data; this.staffListIsLoaded = true; }
        this.isLoaded = true; this.staffCount = 0; for (let i = 0; i < this.apiStaffItems.length; i++) { this.staffCount++; } },
      (err: any) => {
        switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getStaffStatusData() {
    return this.http.post<any[]>(`${this.appUrl}vault/allstaffs/`, {});
  }

  getStaffStatusItems() {
    this.isComp = JSON.parse(localStorage.getItem('isComp')); let companyName = localStorage.getItem('compName');
    this.currentUserID = Number(localStorage.getItem('user_id')); this.isLoaded = false;
    return this.getStaffStatusData().subscribe(
      (data) => {
        if (this.isComp) {
          data.filter((item) => {
            if (item.company === companyName) { this.apiStaffStatusItems.push(item); } }); this.staffListIsLoaded = true;
        } else { this.apiStaffStatusItems = data; this.staffListIsLoaded = true; } this.isLoaded = true;
      },
      (err: any) => {
        switch (err.status) {  case 401: { this.auth.refreshJWT(); break; } } } );
  }

  countStaffItems() { this.staffCount = 0; for (let i = 0; i < this.apiItems.length; i++) { this.staffCount++; } return this.staffCount; }

  activateUser(user, firstname, lastname) {
    return this.http.post(`${this.appUrl}vault/activate/user/`, { user_id: user }).subscribe(
      (res) => { this.getStaffStatusItems(); alert(firstname + ' ' + lastname + ' successfully activated'); },
      (err: any) => {
        // this.auth.getGeneralErrorMessages(err);
      }
    );
  }

  deactivateUser(user, firstname, lastname) {
    return this.http.post(`${this.appUrl}vault/deactivate/user/`, { user_id: user }).subscribe(
      (res) => {
        // console.log(res);
        this.getStaffStatusItems();
        alert(firstname + ' ' + lastname + ' successfully deactivated');
      },
      (err: any) => {
        // this.auth.getGeneralErrorMessages(err);
      }
    );
  }

  getSuperMerchantStaffData() {
    return this.http.post<any[]>(`${this.appUrl}vault/supermerch/staffs/`, [{}]);
  }

  getSuperMerchantStaffItems() {
    this.isLoaded = false; this.staffListIsLoaded = false;
    return this.getSuperMerchantStaffData().subscribe(
      (data) => { this.superMerchantStaffItems = data; this.staffListIsLoaded = true; this.isLoaded = true; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getCompanyList() { return this.http.get<any[]>(`${this.appUrl}vault/company/`); }

  getCompanyListItems() {
    return this.getCompanyList().subscribe(
      (data) => { this.companyListItems = data; }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } } );
  }

  getCompanyListItemsII() {
    this.isComp = JSON.parse(localStorage.getItem('isComp')); this.currentUserID = Number(localStorage.getItem('user_id'));
    this.getCompanyList().subscribe(
      (data) => { this.companyListItems = data; return this.companyListItems; },
      (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } }
    );
  }

  displayStaff(staff) { this.selectedStaffMember = staff; }

  getAllItems() {

  }


  getAgentListData() {

  }

  getAgentListItems() {
    this.agentList = this.mockAgentList;
    return this.agentList;
  }

  getAgentTaskData() {

  }

  getAgentTaskList(agent) {
    this.agentTasks = agent.tasks;
    return this.agentTasks;
  }

  getAgentTaskCount() {
    // return this.agentTasks;
  }

  getAgentVisitedLocations() {
    return this.agentVisitedLocations;
  }

  getAgentTransactionListData() {

  }

  getAgentTransactionListItems() {

  }

  resetCounters() { this.userCount = 0; }

}
