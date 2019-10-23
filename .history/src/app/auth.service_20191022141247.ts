import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginInvalid: boolean;
  isUploading: boolean;

  /* *******USER GROUPS****** */
  /*
  sid 1
  mgt 2
  staff 3
  security 4
  school 5
  */

  private apiUrl = environment.apiUrl;

  // Authentication Variables
  isAuthenticated: boolean;
  timer: any;
  increaseTimer: () => void;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async getJWT(username, password) {
    this.isUploading = true;
     return this.http.post<any>(`${this.apiUrl}api/token/`, { username: username, password: password })
     .subscribe((res) => {
      // localStorage.setItem('tokenRefresh', res.refresh); localStorage.setItem('tokenAccess', res.access);
      localStorage.setItem('prjctTokenRefresh', res.refresh); localStorage.setItem('prjctTokenAccess', res.access);
      this.isUploading = false;
    },
      (err: any) => {
        // if (err.status === 401 || err.status === 400) { this.isActiveCheck(username, password); }
        console.log(err);
        this.loginInvalid = true;
        switch (err.status) {
          // case 400: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE401; break; }
          // case 401: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE401; break; }
          // case 403: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.loginE403; break; }
          // case 500: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.e500; break; }
          // case 503: { this.errorMessage = ERROR_MESSAGE_DICTIONARY.e503; break; }
        }
        this.isUploading = false;
      });
  }

  async refreshJWT() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return this.http.post<any>(`${this.apiUrl}api/token/refresh/`, { username: username, password: password })
    .subscribe((res) => {
      localStorage.removeItem('prjctTokenRefresh');
      localStorage.removeItem('prjctTokenAccess');
      localStorage.setItem('prjctTokenRefresh', res.refresh);
      localStorage.setItem('prjctTokenAccess', res.access);
      this.isUploading = false; window.location.reload();
    },
      (err: any) => { window.location.reload(); localStorage.clear(); this.router.navigate(['login/']); });
  }

  login(username: string, password: string) {
      localStorage.clear();
       this.getJWT(username, password);
      let loginInfo = { username: username, password: password };
      this.loginInvalid = false;
      this.isUploading = true;
       /*this.isActiveCheck(uname,pwd);*/
      return this.http.post<any>(this.apiUrl + 'login/', loginInfo)
      .pipe(
      tap( async res => {
        console.log(res);
          if (res) {
            await localStorage.setItem('user_id', (res.id));
            await localStorage.setItem('username', (res.username));
             await localStorage.setItem('password', (password));
            await localStorage.setItem('isAuth', 'true');
            this.isAuthenticated = Boolean(localStorage.getItem('isAuth'));
            this.timedLogout();

            await localStorage.setItem('user_g', (res.groups[0]));

            // this.userGroup = res.groups[0];
            // this.allowRoutes();
            this.router.navigate(['dashboard/']); this.isUploading = false;
          }
      }),
      catchError(err => {
          this.loginInvalid = true;
          console.log(err);
        // this.getGeneralErrorMessages(err);
          this.isUploading = false;
          return of(false);
        })).subscribe(resp => {
          if (!resp) { this.loginInvalid = true; } else {}
        });
  }

  timedLogout() {
    if (Boolean(localStorage.getItem('isAuth')) === true) {
      this.increaseTimer = window.onmousemove = () => { this.resetTimer(); }
      this.timer = setTimeout(() => { this.logout(); }, 600000);
    }
  }

  resetTimer() { this.endTimer(); this.timedLogout(); }
    // t = setTimeout(reload, 300000);  // time is in milliseconds (1000 is 1 second)
  endTimer() { if (Boolean(localStorage.getItem('isAuth')) === true) { clearTimeout(this.timer); } }

  logout() {
    clearTimeout(this.timer); localStorage.clear();
    return this.http.get<any>(`${this.apiUrl}logout/`)
    .subscribe((res) => { this.router.navigate(['initial/']); },
    (err: any) => { console.log(err); });
  }

}
