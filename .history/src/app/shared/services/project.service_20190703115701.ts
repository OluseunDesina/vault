import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appConfig } from '../../app.config';
import { AuthService } from 'src/app/shared/services/auth.service';


@Injectable()
export class ProjectService {

  constructor(private http: HttpClient, public auth: AuthService, public cookieService: CookieService) { }

  public isUploading: boolean = false; public isLoaded: boolean = false; public isLoading: boolean = false;
  public alumniListItems: any[] = []; public undergraduateListItems: any[] = []; public postgraduateListItems: any[] = []; public staffListItems: any[] = [];
  public validAlumniListItems: any[] = []; public validUndergraduateListItems: any[] = []; public validPostgraduateListItems: any[] = []; public validStaffListItems: any[] = [];
  public validDataListItems: any[] = []; public approvedDataListItems: any[] = []; public uploadedDataListItems: any[] = [];
  public selectedIndividual: any = {}; public totalUsersCount: number = 0; public alumniCount: number = 0; 
  public undergraduateCount: number = 0; public postgraduateCount: number = 0; public staffCount: number = 0;
  public countList: number[]; public branchListItems: any[];

  public userListItems: any[] = []; public userGroupListItems: any[] = []; public deviceListItems: any[] = []; public doorListItems: any[] = []; 
  public accessLevelListItems: any[] = [];
  //biostar
  public biostarUsersInDeviceItems: any[]; public biostarAccessLevels: any[]; public biostarAccessGroups: any[]; public biostarScheduleListItems: any[];
  public allBiostarDeviceItems: any[]; public allBiostarUsers: any[];

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('prjctTokenAccess'), }) }

  //Get Lists Section

  getAccessLevelList() {
    return this.http.get<any[]>(`${appConfig.apiUrl}vault/branch/`, this.httpOptions);
  }
  getAccessLevelListItems() {
    return this.getAccessLevelList().subscribe(
      (data) => { this.accessLevelListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
    );
  }

  getBranchList() {
    return this.http.get<any[]>(`${appConfig.apiUrl}vault/branch/`, this.httpOptions);
  }
  getBranchListItems() {
    return this.getBranchList().subscribe(
      (data) => { this.branchListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
    );
  }

  // getUserList() {
  //   return this.http.get<any[]>(`${appConfig.apiUrl}vault/tesp/`, this.httpOptions);
  // }
  // getUserListItems() {
  //   return this.getUserList().subscribe(
  //     (data) => { this.userListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
  //   );
  // }

  getUserGroupList() {
    return this.http.get<any[]>(`${appConfig.apiUrl}vault/branch/`, this.httpOptions);
  }
  getUserGroupListItems() {
    return this.getUserGroupList().subscribe(
      (data) => { this.userGroupListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
    );
  }

  getDeviceList() {
    return this.http.get<any[]>(`${appConfig.apiUrl}vault/branch/`, this.httpOptions);
  }
  getDeviceListItems() {
    return this.getDeviceList().subscribe(
      (data) => { this.deviceListItems = data; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
    );
  }

  getDoorList() {
    return this.http.post<any>(`${appConfig.apiUrl}vault/gdra/`, { limit: 1000, offset: 0 }, this.httpOptions);
  }
  getDoorListItems() {
    return this.getDoorList().subscribe(
      (data) => { this.doorListItems = data.records; console.log(data); this.isLoaded = true; }, (err: any) => { console.log(err); }
    );
  }


  getAlumniListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/coalumni/`, this.httpOptions); }
  getAlumniListItems() { this.isLoading = true;
    return this.getAlumniListData().subscribe(
      (data) => { this.alumniListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getUndergraduateListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/coug/`, this.httpOptions); }
  getUndergraduateListItems() { this.isLoading = true;
    return this.getUndergraduateListData().subscribe(
      (data) => { this.undergraduateListItems = data; this.isLoading = false;}, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getPostgraduateListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/copglist/`, this.httpOptions); }
  getPostgraduateListItems() { this.isLoading = true; 
    return this.getPostgraduateListData().subscribe(
      (data) => { this.postgraduateListItems = data; this.isLoading = false; }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getStaffListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/costaff/`, this.httpOptions); }
  getStaffListItems() { this.isLoading = true;
    return this.getStaffListData().subscribe(
      (data) => { this.staffListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getValidAlumniListData() { return this.http.post<any[]>(`${appConfig.apiUrl}vault/alalum/`, {}, this.httpOptions); }
  getValidAlumniListItems() {
  this.isLoading = true;
    return this.getValidAlumniListData().subscribe(
      (data) => { this.validAlumniListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getValidUndergraduateListData() { return this.http.post<any[]>(`${appConfig.apiUrl}vault/cheug/`, {}, this.httpOptions); }
  getValidUndergraduateListItems() {
  this.isLoading = true;
    return this.getValidUndergraduateListData().subscribe(
      (data) => { this.validUndergraduateListItems = data; this.isLoading = false; console.log(data) }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getValidPostgraduateListData() { return this.http.post<any[]>(`${appConfig.apiUrl}vault/valpg/`, {}, this.httpOptions); }
  getValidPostgraduateListItems() {
  this.isLoading = true;
    return this.getValidPostgraduateListData().subscribe(
      (data) => { this.validPostgraduateListItems = data; console.log(data); this.isLoading = false; }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getValidStaffListData() { return this.http.post<any[]>(`${appConfig.apiUrl}vault/nosta/`, {}, this.httpOptions); }
  getValidStaffListItems() {
  this.isLoading = true;
    return this.getValidStaffListData().subscribe(
      (data) => { this.validStaffListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }



  getApprovedDataListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/coug/`, this.httpOptions); }
  getApprovedDataListItems() { this.isLoading = true;
    return this.getApprovedDataListData().subscribe(
      (data) => { this.approvedDataListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getUploadedDataListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/copglist/`, this.httpOptions); }
  getUploadedDataListItems() {
    return this.getUploadedDataListData().subscribe(
      (data) => { this.uploadedDataListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getValidDataListData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/costaff/`, this.httpOptions); }
  getValidDataListItems() {
    return this.getValidDataListData().subscribe(
      (data) => { this.validDataListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  //End Get Lists Section

  //BioStar

  getBiostarUsersInDeviceData(devID) { return this.http.post<any>(`${appConfig.apiUrl}vault/usfdv/`, { dev_id: devID, limit: 1000, offset: 0 }, this.httpOptions); }
  getBiostarUsersInDeviceItems(devID) {
    return this.getBiostarUsersInDeviceData(devID).subscribe(
      (data) => { this.biostarUsersInDeviceItems = data.records; console.log(data); this.isLoading = false; }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getAllBiostarDevicesData() { return this.http.post<any>(`${appConfig.apiUrl}vault/bdev/`, { limit: 1000, offset: 0 }, this.httpOptions); }
  getAllBiostarDevicesItems() {
    return this.getAllBiostarDevicesData().subscribe(
      (data) => { this.allBiostarDeviceItems = data.records; console.log('1', data.records); this.isLoading = false; }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getAllBiostarUsersData() { return this.http.post<any>(`${appConfig.apiUrl}vault/tesp/`, {limit:1000, offset:0}, this.httpOptions); }
  getAllBiostarUsersItems() {
    return this.getAllBiostarUsersData().subscribe(
      (data) => { this.allBiostarUsers = data.records; console.log('2', data.records);  this.isLoading = false; }, (err: any) => { console.log(err); this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getBiostarAccessLevelData() { return this.http.post<any>(`${appConfig.apiUrl}vault/asclfa/`, { limit: 1000, offset: 0 }, this.httpOptions); }
  getBiostarAccessLevelItems() {
    return this.getBiostarAccessLevelData().subscribe(
      (data) => { this.biostarAccessLevels = data.records; console.log(data); this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getBiostarAccessGroupData() { return this.http.post<any>(`${appConfig.apiUrl}vault/gfa/`, { limit: 1000, offset: 0 }, this.httpOptions); }
  getBiostarAccessGroupItems() {
    return this.getBiostarAccessGroupData().subscribe(
      (data) => { this.biostarAccessGroups = data.records; console.log(data); this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getBiostarUserGroupData() { return this.http.get<any[]>(`${appConfig.apiUrl}vault/gug/`, this.httpOptions); }
  getBiostarUserGroupItem() {
    return this.getBiostarUserGroupData().subscribe(
      (data) => { this.userGroupListItems = data; this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getBiostarScheduleListData() { return this.http.post<any>(`${appConfig.apiUrl}vault/gsfap/`, { limit: 1000, offset: 0 }, this.httpOptions); }
  getBiostarScheduleListItems() {
    return this.getBiostarScheduleListData().subscribe(
      (data) => { this.biostarScheduleListItems = data.records; console.log(data); this.isLoading = false; }, (err: any) => { this.isLoading = false; switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }



  ///////////////////////////////////////////////////

  checkAllUnassignedCard() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/total/cunas/`, { limit: 1000, offset: 0 }, this.httpOptions).subscribe(
      async (data) => {
        
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getTotalUsersCount() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/total/users/`, {}, this.httpOptions).subscribe(
      async (data) => {
        this.totalUsersCount = 0; this.isLoading = false; console.log(data);
        this.totalUsersCount = data[0].total; if (data = []) { return 0; } return this.totalUsersCount;
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getAlumniCount() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/alucount/`, {}, this.httpOptions).subscribe(
      async (data) => { this.alumniCount = 0; this.isLoading = false;
        this.alumniCount = data[0].total; if (data = []) { return 0; } return this.alumniCount;
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }
  
  getPostgraduateCount() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/pgcount/`, {}, this.httpOptions).subscribe(
      async (data) => { this.postgraduateCount = 0; this.isLoading = false; 
      this.postgraduateCount = data[0].total; if (data = []) { return 0; } return this.postgraduateCount;
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getUndergraduateCount() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/ugcount/`, {}, this.httpOptions).subscribe(
      async (data) => { this.undergraduateCount = 0; this.isLoading = false; console.log(data);
        this.undergraduateCount = data[0].total; if (data = []) { return 0; } return this.undergraduateCount; 
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }

  getStaffCount() {
    this.http.post<any[]>(`${appConfig.apiUrl}vault/stacount/`, {}, this.httpOptions).subscribe(
      async (data) => {
        this.staffCount = 0; this.isLoading = false; console.log(data);
        this.staffCount = data[0].total; if (data = []) { return 0; } return this.staffCount;
      }, (err: any) => { switch (err.status) { case 401: { this.auth.refreshJWT(); break; } } });
  }


  //////

  addOneUserToDevice(registerInfo, user) {
    this.isUploading = true;
    let postInfo = {
      dev_id: registerInfo.dev_id,
      users_id: user,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/adout/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(res.message); console.log(res);
    },
      (err: any) => {
        console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  deleteOneUserFromDevice(registerInfo, user) {
    this.isUploading = true;
    let postInfo = {
      dev_id: registerInfo.dev_id,
      users_id: user,
    }; console.log(postInfo);
    return this.http.post<any>(`${appConfig.apiUrl}vault/doufd/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(res.message); console.log(res);
    },
      (err: any) => {
        console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }


  addUsersToDevice(registerInfo, users) {
    this.isUploading = true;
    let postInfo = {
      dev_id: registerInfo.dev_id,
      users_id: users,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/adutd/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(res.message);console.log(res);
    },
      (err: any) => { console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  deleteUsersFromDevice(registerInfo, users) {
    this.isUploading = true;
    let postInfo = {
      dev_id: registerInfo.dev_id,
      users_id: users,
    }; console.log(postInfo);
    return this.http.post<any>(`${appConfig.apiUrl}vault/dusfrd/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(res.message); console.log(res);
    },
      (err: any) => {
        console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }


  // "access_groups": "4",
  // "email": "chytory@yahoo.com",
  // "expiry_datetime": "2019-06-10T02:14:05.268Z",
  // "login_id": "chivapce",
  // "name": "Peace",
  // "password": "mnbvcxz1",
  // "permission": 255,
  // "phone_number": "08169373694",
  // "pin": "00176",
  // "security_level": "0",
  // "start_datetime": "2019-06-10T02:14:05.268Z",
  // "status": "AC",


  
  addUserToBiostar(registerInfo) {
    this.isUploading = true;
    let postInfo = {
      access_groups: registerInfo.access_groups,
      email: registerInfo.email,
      expiry_datetime: registerInfo.expiry_datetime,
      login_id: registerInfo.login_id,
      name: registerInfo.name,
      password: registerInfo.password,
      permission: registerInfo.permission,
      phone_number: registerInfo.phone_number,
      pin: registerInfo.pin,
      security_level: registerInfo.security_level,
      start_datetime: registerInfo.start_datetime,
      status: registerInfo.status,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      // alert(`Biostar User: ${regInfo.name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  addBiostarSchedule(registerInfo) {
    this.isUploading = true;
    let start_date = registerInfo.start_date.toISOString();
    let postInfo = {
      id: registerInfo.id,
      daily_schedules: '',
      description: registerInfo.description,
      holiday_schedules: '',
      is_weekly: true,
      name: registerInfo.name,
      schedule_period: registerInfo.schedule_period,
      start_date: start_date,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/bscd/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false; console.log(res);
      // alert(`Biostar User: ${regInfo.name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => { console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  addBiostarAccessLevel(registerInfo) {
    this.isUploading = true;
    let postInfo = {
      description: registerInfo.description,
      items: [
        {
        schedule: {
          name: registerInfo.schedule.name,
          id: registerInfo.schedule.id,
        },
          door_list: [{
            name: registerInfo.door.name,
            id: registerInfo.door.id,
          }],
        }

      ],
      name: registerInfo.name,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/bacsl/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;console.log(res);
      // alert(`Biostar User: ${regInfo.name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {console.log(err);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  addBiostarAccessGroup(registerInfo) {
    this.isUploading = true;
    let postInfo = {
      access_levels: registerInfo.access_levels,
      description: registerInfo.description,
      user_groups: registerInfo.user_groups,
      users: registerInfo.users,
      name: registerInfo.name,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/bbaccg/`, postInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      // alert(`Biostar User: ${regInfo.name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  // id = models.AutoField(primary_key = True)
  // access_groups = models.CharField(max_length = 100)
  // email = models.CharField(max_length = 100, unique = True)
  // expiry_datetime = models.CharField(max_length = 100)
  // login_id = models.CharField(max_length = 100, unique = True)
  // name = models.CharField(max_length = 100)
  // password = models.CharField(max_length = 100)
  // permission = models.IntegerField()
  // phone_number = models.CharField(max_length = 100)
  // pin = models.CharField(max_length = 100)
  // security_level = models.CharField(max_length = 100)
  // start_datetime = models.CharField(max_length = 100)
  // status = models.CharField(max_length = 100)
  // user_group = JSONField()
  // user_id = models.CharField(max_length = 100, unique = True)
  // card_id = JSONField()

  createBiostarUser(registerInfo) {
    this.isUploading = true;
    let start_date = registerInfo.start_date.toISOString();
    let expiry_date = registerInfo.expiry_date.toISOString();
    let regInfo = {
      access_groups: registerInfo.access_groups,
      email: registerInfo.email,
      user_id: registerInfo.user_id,
      card_id: registerInfo.card_id,
      name: registerInfo.name,
      security_level: registerInfo.security_level,
      phone_number: registerInfo.phone_number,
      pin: registerInfo.pin,
      login_id: registerInfo.login_id,
      password: registerInfo.password,
      start_datetime: start_date,
      expiry_datetime: expiry_date,
      status: 'AC',
      user_group: registerInfo.user_group,
      permission: registerInfo.permission,
    }; console.log('1', registerInfo); console.log('2', regInfo);
    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, regInfo, this.httpOptions).subscribe((res) => {
      this.isUploading = false;
      alert(`Biostar User: ${regInfo.name} created successfully. Please let user know that they should check their email for confirmation.`);
    },
      (err: any) => {
        console.log(err); console.log('1', registerInfo); console.log('2', regInfo);
        this.auth.getCreateUserErrorMessages(err);
        this.isUploading = false;
      });
  }

  //Post Excel Section
  sendParsedAlumniData(htmlWorkbookJSON) {
    this.isUploading = true;
    let formattedWorkbookJSON = []

    for (let i = 0; i < htmlWorkbookJSON.length; i++) {
      let formattedData = {
        surname: htmlWorkbookJSON[i].surname,
        firstname: htmlWorkbookJSON[i].firstname,
        middle_name: htmlWorkbookJSON[i].middle_name,
        card: '1',/*htmlWorkbookJSON[i].card,*/
        matric_no: htmlWorkbookJSON[i].matric_no,
        faculty: htmlWorkbookJSON[i].faculty,
        department_name: htmlWorkbookJSON[i].department_name,
        sex: htmlWorkbookJSON[i].sex,
        graduation_year: htmlWorkbookJSON[i].graduation_year,
        mobile_no: htmlWorkbookJSON[i].mobile_no,
        email: htmlWorkbookJSON[i].email,
        contact_address: htmlWorkbookJSON[i].contact_address,
        image: appConfig.apiUrl + 'media/alumni/' + this.filterSlash(htmlWorkbookJSON[i].matric_no) + '.jpg',
        signature: '',
        status: 0
      }
      formattedWorkbookJSON.push(formattedData);
    } console.log(formattedWorkbookJSON);
    return this.http.post<any>(`${appConfig.apiUrl}vault/alumni/`, formattedWorkbookJSON, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; console.log(formattedWorkbookJSON); alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendValidAlumniData(validData) {
    this.isUploading = true;
    let formattedValidData = []
    let todaysDate = new Date();

    for (let i = 0; i < validData.length; i++) {
      let formattedData = {
        access_groups: '0',
        email: validData[i].email_address,
        user_id: validData[i].card,
        card_id: validData[i].card,
        name: validData[i].firstname + ' ' + validData.surname,
        security_level: '0',
        phone_number: validData[i].mobile_no,
        pin: validData[i].card,
        login_id: validData[i].card,
        password: validData[i].card,
        start_datetime: '',
        expiry_datetime: '',
        status: 'AC',
        user_group: [],
        permission: 255,
      };
      formattedValidData.push(formattedData);
    }
    

    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, formattedValidData, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false;
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendValidUndergraduateData(validData) {
    this.isUploading = true;
    let formattedValidData = []
    let todaysDate = new Date();

    for (let i = 0; i < validData.length; i++) {
      let formattedData = {
      access_groups: '0',
      email: validData[i].email_address,
      user_id: validData[i].card,
      card_id: validData[i].card,
      name: validData[i].firstname + ' ' + validData.lastname,
      security_level: '0',
      phone_number: validData[i].mobile_no,
      pin: validData[i].card,
        login_id: validData[i].card,
        password: validData[i].card,
      start_datetime: '',
      expiry_datetime: '',
      status: 'AC',
      user_group: [],
      permission: 255,
    };
      formattedValidData.push(formattedData);
    }
    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, formattedValidData, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false;
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendValidPostgraduateData(validData) {
      this.isUploading = true;
      let formattedValidData = []
      let todaysDate = new Date();

      for (let i = 0; i < validData.length; i++) {
        let formattedData = {
          access_groups: '0',
          email: '',
          user_id: validData[i].card,
          card_id: validData[i].card,
          name: validData[i].firstname + ' ' + validData[i].surname,
          security_level: '0',
          phone_number: validData[i].mobile_no,
          pin: validData[i].card,
          login_id: validData[i].card,
          password: validData[i].card,
          start_datetime: '',
          expiry_datetime: '',
          status: 'AC',
          user_group: 5,
          permission: 255,
    };
        formattedValidData.push(formattedData);
    } console.log(formattedValidData);
    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, formattedValidData, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); console.log(res);
    },
      (err: any) => { console.log(err);
        this.isUploading = false;
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendValidStaffData(validData) {
        this.isUploading = true;
        let formattedValidData = []
        let todaysDate = new Date();

        for (let i = 0; i < validData.length; i++) {
          let formattedData = {
          access_groups: '0',
            email: validData[i].email_address,
            user_id: validData[i].card,
            card_id: validData[i].card,
            name: validData[i].fullname,
          security_level: '0',
            phone_number: validData[i].mobile_no,
            pin: validData[i].card,
            login_id: validData[i].card,
            password: validData[i].card,
          start_datetime: '',
          expiry_datetime: '',
          status: 'AC',
          user_group: [],
          permission: 255,
        };
          formattedValidData.push(formattedData);
        }

    return this.http.post<any>(`${appConfig.apiUrl}vault/work/`, formattedValidData, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false;
        this.auth.getGeneralErrorMessages(err);
      });
  }

  // id = models.AutoField(primary_key = True)
  // surname = models.CharField(max_length = 100)
  // firstname = models.CharField(max_length = 100)
  // other_names = models.CharField(max_length = 100)
  // card = models.CharField(max_length = 100, null = True, blank = True)
  // matric_no = models.CharField(max_length = 20)
  // faculty = models.CharField(max_length = 250)
  // department_name = models.CharField(max_length = 250)
  // sex = models.CharField(max_length = 8)
  // graduation_year = models.CharField(max_length = 100)
  // mobile_no = models.CharField(max_length = 15)
  // email_address = models.CharField(max_length = 100)
  // residential_address = models.TextField()
  // image = models.ImageField(upload_to = 'photo/', default = 'default.png')
  // signature = models.ImageField()
  // status = models.CharField(max_length = 4, choices = ALL_STATUS, default = 'Inc')

  filterSlash(value) {
    try{
      if (value.indexOf('/') > -1) {
        let slashCount = value.match((/\//g)).length;
        let combinedString = "";
        combinedString = value.split('/')[0];
        for (let i = 1; i <= slashCount; i++) {
          if (i <= slashCount) {
            combinedString += '-' + value.split('/')[i] + '';
          }
        }
        return combinedString;
      }
      else {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    } catch (err) {
      this.isUploading = false;
    }
    
  }

  sendParsedUndergraduateData(htmlWorkbookJSON) {
    this.isUploading = true;
    let formattedWorkbookJSON = []
    console.log('Upload Step 2');
    for(let i = 0; i < htmlWorkbookJSON.length; i++){
      let formattedData = {
        surname: htmlWorkbookJSON[i].surname,
        firstname: htmlWorkbookJSON[i].firstname,
        other_names: htmlWorkbookJSON[i].other_names,
        card: '1',/*htmlWorkbookJSON[i].card,*/
        matric_no: htmlWorkbookJSON[i].matric_no,
        faculty: htmlWorkbookJSON[i].faculty,
        department_name: htmlWorkbookJSON[i].department_name,
        sex: htmlWorkbookJSON[i].sex,
        graduation_year: htmlWorkbookJSON[i].graduation_year,
        mobile_no: htmlWorkbookJSON[i].mobile_no,
        email_address: htmlWorkbookJSON[i].email_address,
        residential_address: htmlWorkbookJSON[i].residential_address,
        image: appConfig.apiUrl + 'media/undergraduate/' + this.filterSlash(htmlWorkbookJSON[i].matric_no) + '.jpg',
        signature: '',
        status: 0
      }
      formattedWorkbookJSON.push(formattedData);
    }console.log(formattedWorkbookJSON);
    return this.http.post<any>(`${appConfig.apiUrl}vault/ug/`, formattedWorkbookJSON, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; console.log(formattedWorkbookJSON); alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }
  sendParsedPostgraduateData(htmlWorkbookJSON) {
    this.isUploading = true;
    let formattedWorkbookJSON = []

    for (let i = 0; i < htmlWorkbookJSON.length; i++) {
      let formattedData = {
        surname: htmlWorkbookJSON[i].surname,
        firstname: htmlWorkbookJSON[i].firstname,
        other_names: htmlWorkbookJSON[i].other_names,
        card: htmlWorkbookJSON[i].card,
        matric_no: htmlWorkbookJSON[i].matric_no,
        faculty_name: htmlWorkbookJSON[i].faculty_name,
        department_name: htmlWorkbookJSON[i].department_name,
        sex: htmlWorkbookJSON[i].sex,
        entry_year: htmlWorkbookJSON[i].entry_year,
        graduation_year: htmlWorkbookJSON[i].graduation_year,
        mobile_no: htmlWorkbookJSON[i].mobile_no,
        email_address: htmlWorkbookJSON[i].email_address,
        residential_address: htmlWorkbookJSON[i].residential_address,
        image: appConfig.apiUrl + 'media/postgraduate/' + this.filterSlash(htmlWorkbookJSON[i].matric_no) + '.jpg',
        signature: '',
        status: 0,
        date_of_birth: htmlWorkbookJSON[i].date_of_birth,
        state_of_origin: htmlWorkbookJSON[i].state_of_origin,
      }
      formattedWorkbookJSON.push(formattedData);
    } console.log(formattedWorkbookJSON);
    return this.http.post<any>(`${appConfig.apiUrl}vault/pglist/`, formattedWorkbookJSON, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); console.log(res);
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }
  sendParsedStaffData(htmlWorkbookJSON) {
    this.isUploading = true;
    let formattedWorkbookJSON = []
    
    for (let i = 0; i < htmlWorkbookJSON.length; i++) {
      let formattedData = {
        fullname: htmlWorkbookJSON[i].fullname,
        designation: htmlWorkbookJSON[i].designation,
        card: '1',/*htmlWorkbookJSON[i].card,*/
        staff_no: htmlWorkbookJSON[i].staff_no,
        faculty: htmlWorkbookJSON[i].faculty,
        department: htmlWorkbookJSON[i].department,
        gender: htmlWorkbookJSON[i].gender,
        mobile_no: htmlWorkbookJSON[i].mobile_no,
        email: htmlWorkbookJSON[i].email,
        genotype: htmlWorkbookJSON[i].genotype,
        blood_group: htmlWorkbookJSON[i].blood_group,
        contact_address: htmlWorkbookJSON[i].contact_address,
        image: appConfig.apiUrl + 'media/staff/' + htmlWorkbookJSON[i].matric_no + '.jpg',
        signature: '',
        status: 0
      }
      formattedWorkbookJSON.push(formattedData);
    } console.log(formattedWorkbookJSON);
    return this.http.post<any>(`${appConfig.apiUrl}vault/staff/`, formattedWorkbookJSON, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendParsedCardData(htmlWorkbookJSON) {
    this.isUploading = true;
    let formattedWorkbookJSON = []

    for (let i = 0; i < htmlWorkbookJSON.length; i++) {
      let formattedData = {
        card: htmlWorkbookJSON[i].card,/*htmlWorkbookJSON[i].card,*/
      }
      formattedWorkbookJSON.push(formattedData);
    } console.log(formattedWorkbookJSON);
    return this.http.post<any>(`${appConfig.apiUrl}vault/bcard/`, formattedWorkbookJSON, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }

  sendParsedUserIDData(htmlWorkbookJSON, devID) {
    this.isUploading = true;
    let formattedWorkbookJSON = []

    for (let i = 0; i < htmlWorkbookJSON.length; i++) {
      let formattedData = {
        user_id: htmlWorkbookJSON[i].user_id,/*htmlWorkbookJSON[i].card,*/
      }
      formattedWorkbookJSON.push(formattedData);
    } console.log(formattedWorkbookJSON);

    let postInfo = {
      dev_id: devID,
      users_id: formattedWorkbookJSON,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/adutd/`, postInfo, this.httpOptions).subscribe((res) => {
      /*this.getItems();*/ this.isUploading = false; alert('Data successfully uploaded'); window.location.reload();
    },
      (err: any) => {
        this.isUploading = false; console.log(err);
        this.auth.getGeneralErrorMessages(err);
      });
  }
  //End Post Excel Section

}
