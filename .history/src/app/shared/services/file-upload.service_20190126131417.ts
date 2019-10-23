import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { appConfig } from '../../app.config';
@Injectable()

export class FileUploadService {
  /*
    1. vault/uploads/(?P<filename>[^/]+)$ where (?P<filename>[^/]+)  contains the file  with a PUT statement 
    2. vault/myupodd/ with a PUT statement 
    3. vault/upload/
    4. vault/file/
  */
  private serviceUrl: string = 'vault/inventory/';
  private apiUrl = appConfig.apiUrl + this.serviceUrl;
  public apiItems: any[];
  public stockItems: any[];

  public isLoaded: boolean = false;
  public companyListItems: any[];
  public userListItems: any[];
  public isUploading: boolean;
  public foodListItems: any[];

  public httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Bearer ' + this.cookieService.get('prjctTokenAccess'), }) }


  constructor(private http: HttpClient, public cookieService: CookieService) { }


  create(createForm, foodID) {
    this.isUploading = true;
    let createInfo = {
      quantity: createForm.quantity,
      food: foodID,
      user: Number(this.cookieService.get('user_id')),
      company_name: createForm.company_name,
    };
    return this.http.post<any>(`${appConfig.apiUrl}vault/inventory/`, createInfo).subscribe((res) => {
      alert(createInfo.food + ' details updated to - Quantity: ' + createInfo.quantity + ', Company: ' + createInfo.company_name);
      ////console.log(res);
      this.isUploading = false;

    },
      (err: any) => {
        //console.log(err)
      });
  }

  uploadTopUpFile(FileData) {
    return this.http.put<any>(`${appConfig.apiUrl}vault/myupodd/`, FileData).subscribe((res) => {
      // alert(createInfo.food + ' details updated to - Quantity: ' + createInfo.quantity + ', Company: ' + createInfo.company_name);
      ////console.log(res);
      this.isUploading = false;

    },
      (err: any) => {
        //console.log(err)
      });
  }

  uploadTopUpFileTwo(FileData) {
    return this.http.post<any>(`${appConfig.apiUrl}vault/upload/`, FileData).subscribe((res) => {
      // alert(createInfo.food + ' details updated to - Quantity: ' + createInfo.quantity + ', Company: ' + createInfo.company_name);
      ////console.log(res);
      this.isUploading = false;

    },
      (err: any) => {
        //console.log(err)
      });
  }


}
