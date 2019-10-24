import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate, CanActivateChild {

  private isAllowed = false;
  constructor(
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = Number(localStorage.getItem('user_group'));
    // console.log(route.routeConfig);
    if (role === 1) {
      // sid 1
      switch (route.routeConfig.path) {
        case 'dashboard': { this.isAllowed = true; break; }
        case 'items-create': { this.isAllowed = true; break; }
        case 'items-list': { this.isAllowed = true; break; }
        case 'items-edit/:id': { this.isAllowed = true; break; }
        case 'customer-create': { this.isAllowed = true; break; }
        case 'customer-list': { this.isAllowed = true; break; }
        case 'customer-edit/:id': { this.isAllowed = true; break; }
        case 'earnings-create': { this.isAllowed = true; break; }
        case 'earnings-list': { this.isAllowed = true; break; }
        case 'earnings-edit/:id': { this.isAllowed = true; break; }
        case 'campaign-create': { this.isAllowed = true; break; }
        case 'campaign-list': { this.isAllowed = true; break; }
        case 'campaign-edit/:id': { this.isAllowed = true; break; }
        case 'special-reward-create': { this.isAllowed = true; break; }
        case 'special-reward-list': { this.isAllowed = true; break; }
        case 'special-reward-edit/:id': { this.isAllowed = true; break; }
        case 'segment-create': { this.isAllowed = true; break; }
        case 'segment-list': { this.isAllowed = true; break; }
        case 'segment-edit/:id': { this.isAllowed = true; break; }
        case 'pos-create': { this.isAllowed = true; break; }
        case 'pos-list': { this.isAllowed = true; break; }
        case 'pos-edit/:id': { this.isAllowed = true; break; }
        case 'level-create': { this.isAllowed = true; break; }
        case 'level-list': { this.isAllowed = true; break; }
        case 'level-edit/:id': { this.isAllowed = true; break; }
        case 'localization-create': { this.isAllowed = true; break; }
        case 'localization-list': { this.isAllowed = true; break; }
        case 'localization-edit/:id': { this.isAllowed = true; break; }
        case 'merchant-create': { this.isAllowed = true; break; }
        case 'merchant-list': { this.isAllowed = true; break; }
        case 'merchant-edit/:id': { this.isAllowed = true; break; }
        case 'category-create': { this.isAllowed = true; break; }
        case 'category-list': { this.isAllowed = true; break; }
        case 'category-edit/:id': { this.isAllowed = true; break; }
        case 'admin-create': { this.isAllowed = true; break; }
        case 'admin-list': { this.isAllowed = true; break; }
        case 'admin-edit/:id': { this.isAllowed = true; break; }
        case 'supervisor-create': { this.isAllowed = true; break; }
        case 'supervisor-list': { this.isAllowed = true; break; }
        case 'supervisor-edit/:id': { this.isAllowed = true; break; }
        case 'teller-create': { this.isAllowed = true; break; }
        case 'teller-list': { this.isAllowed = true; break; }
        case 'teller-edit/:id': { this.isAllowed = true; break; }
        case 'transaction-list': { this.isAllowed = true; break; }
        case 'cart': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
              }
      // this.auth.allowRoutes();
        return this.isAllowed;
    } else if (role === 2) {
      switch (route.routeConfig.path) {
        case 'dashboard': { this.isAllowed = true; break; }
        case 'items-create': { this.isAllowed = true; break; }
        case 'items-list': { this.isAllowed = true; break; }
        case 'items-edit/:id': { this.isAllowed = true; break; }
        case 'customer-create': { this.isAllowed = true; break; }
        case 'customer-list': { this.isAllowed = true; break; }
        case 'customer-edit/:id': { this.isAllowed = true; break; }
        case 'earnings-create': { this.isAllowed = true; break; }
        case 'earnings-list': { this.isAllowed = true; break; }
        case 'earnings-edit/:id': { this.isAllowed = true; break; }
        case 'campaign-create': { this.isAllowed = true; break; }
        case 'campaign-list': { this.isAllowed = true; break; }
        case 'campaign-edit/:id': { this.isAllowed = true; break; }
        case 'special-reward-create': { this.isAllowed = true; break; }
        case 'special-reward-list': { this.isAllowed = true; break; }
        case 'special-reward-edit/:id': { this.isAllowed = true; break; }
        case 'segment-create': { this.isAllowed = true; break; }
        case 'segment-list': { this.isAllowed = true; break; }
        case 'segment-edit/:id': { this.isAllowed = true; break; }
        case 'pos-create': { this.isAllowed = true; break; }
        case 'pos-list': { this.isAllowed = true; break; }
        case 'pos-edit/:id': { this.isAllowed = true; break; }
        case 'level-create': { this.isAllowed = true; break; }
        case 'level-list': { this.isAllowed = true; break; }
        case 'level-edit/:id': { this.isAllowed = true; break; }
        case 'localization-create': { this.isAllowed = true; break; }
        case 'localization-list': { this.isAllowed = true; break; }
        case 'localization-edit/:id': { this.isAllowed = true; break; }
        case 'merchant-create': { this.isAllowed = true; break; }
        case 'merchant-list': { this.isAllowed = true; break; }
        case 'merchant-edit/:id': { this.isAllowed = true; break; }
        case 'category-create': { this.isAllowed = true; break; }
        case 'category-list': { this.isAllowed = true; break; }
        case 'category-edit/:id': { this.isAllowed = true; break; }
        case 'admin-create': { this.isAllowed = true; break; }
        case 'admin-list': { this.isAllowed = true; break; }
        case 'admin-edit/:id': { this.isAllowed = true; break; }
        case 'supervisor-create': { this.isAllowed = true; break; }
        case 'supervisor-list': { this.isAllowed = true; break; }
        case 'supervisor-edit/:id': { this.isAllowed = true; break; }
        case 'teller-create': { this.isAllowed = true; break; }
        case 'teller-list': { this.isAllowed = true; break; }
        case 'teller-edit/:id': { this.isAllowed = true; break; }
        case 'transaction-list': { this.isAllowed = true; break; }
        case 'cart': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
              }
      // this.auth.allowRoutes();
        return this.isAllowed;
    } else if (role === 3) {
      switch (route.routeConfig.path) {
        case 'dashboard': { this.isAllowed = true; break; }
        case 'items-create': { this.isAllowed = true; break; }
        case 'items-list': { this.isAllowed = true; break; }
        case 'items-edit/:id': { this.isAllowed = true; break; }
        case 'customer-create': { this.isAllowed = true; break; }
        case 'customer-list': { this.isAllowed = true; break; }
        case 'customer-edit/:id': { this.isAllowed = true; break; }
        case 'earnings-create': { this.isAllowed = true; break; }
        case 'earnings-list': { this.isAllowed = true; break; }
        case 'earnings-edit/:id': { this.isAllowed = true; break; }
        case 'campaign-create': { this.isAllowed = true; break; }
        case 'campaign-list': { this.isAllowed = true; break; }
        case 'campaign-edit/:id': { this.isAllowed = true; break; }
        case 'special-reward-create': { this.isAllowed = true; break; }
        case 'special-reward-list': { this.isAllowed = true; break; }
        case 'special-reward-edit/:id': { this.isAllowed = true; break; }
        case 'segment-create': { this.isAllowed = true; break; }
        case 'segment-list': { this.isAllowed = true; break; }
        case 'segment-edit/:id': { this.isAllowed = true; break; }
        case 'pos-create': { this.isAllowed = true; break; }
        case 'pos-list': { this.isAllowed = true; break; }
        case 'pos-edit/:id': { this.isAllowed = true; break; }
        case 'level-create': { this.isAllowed = true; break; }
        case 'level-list': { this.isAllowed = true; break; }
        case 'level-edit/:id': { this.isAllowed = true; break; }
        case 'localization-create': { this.isAllowed = true; break; }
        case 'localization-list': { this.isAllowed = true; break; }
        case 'localization-edit/:id': { this.isAllowed = true; break; }
        case 'merchant-create': { this.isAllowed = true; break; }
        case 'merchant-list': { this.isAllowed = true; break; }
        case 'merchant-edit/:id': { this.isAllowed = true; break; }
        case 'category-create': { this.isAllowed = true; break; }
        case 'category-list': { this.isAllowed = true; break; }
        case 'category-edit/:id': { this.isAllowed = true; break; }
        case 'admin-create': { this.isAllowed = true; break; }
        case 'admin-list': { this.isAllowed = true; break; }
        case 'admin-edit/:id': { this.isAllowed = true; break; }
        case 'supervisor-create': { this.isAllowed = true; break; }
        case 'supervisor-list': { this.isAllowed = true; break; }
        case 'supervisor-edit/:id': { this.isAllowed = true; break; }
        case 'teller-create': { this.isAllowed = true; break; }
        case 'teller-list': { this.isAllowed = true; break; }
        case 'teller-edit/:id': { this.isAllowed = true; break; }
        case 'transaction-list': { this.isAllowed = true; break; }
        case 'cart': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
              }
      // this.auth.allowRoutes();
        return this.isAllowed;
    } else if (role === 4) {
      switch (route.routeConfig.path) {
        case 'dashboard': { this.isAllowed = true; break; }
        case 'items-create': { this.isAllowed = true; break; }
        case 'items-list': { this.isAllowed = true; break; }
        case 'items-edit/:id': { this.isAllowed = true; break; }
        case 'customer-create': { this.isAllowed = true; break; }
        case 'customer-list': { this.isAllowed = true; break; }
        case 'customer-edit/:id': { this.isAllowed = true; break; }
        case 'earnings-create': { this.isAllowed = true; break; }
        case 'earnings-list': { this.isAllowed = true; break; }
        case 'earnings-edit/:id': { this.isAllowed = true; break; }
        case 'campaign-create': { this.isAllowed = true; break; }
        case 'campaign-list': { this.isAllowed = true; break; }
        case 'campaign-edit/:id': { this.isAllowed = true; break; }
        case 'special-reward-create': { this.isAllowed = true; break; }
        case 'special-reward-list': { this.isAllowed = true; break; }
        case 'special-reward-edit/:id': { this.isAllowed = true; break; }
        case 'segment-create': { this.isAllowed = true; break; }
        case 'segment-list': { this.isAllowed = true; break; }
        case 'segment-edit/:id': { this.isAllowed = true; break; }
        case 'pos-create': { this.isAllowed = true; break; }
        case 'pos-list': { this.isAllowed = true; break; }
        case 'pos-edit/:id': { this.isAllowed = true; break; }
        case 'level-create': { this.isAllowed = true; break; }
        case 'level-list': { this.isAllowed = true; break; }
        case 'level-edit/:id': { this.isAllowed = true; break; }
        case 'localization-create': { this.isAllowed = true; break; }
        case 'localization-list': { this.isAllowed = true; break; }
        case 'localization-edit/:id': { this.isAllowed = true; break; }
        case 'merchant-create': { this.isAllowed = true; break; }
        case 'merchant-list': { this.isAllowed = true; break; }
        case 'merchant-edit/:id': { this.isAllowed = true; break; }
        case 'category-create': { this.isAllowed = true; break; }
        case 'category-list': { this.isAllowed = true; break; }
        case 'category-edit/:id': { this.isAllowed = true; break; }
        case 'admin-create': { this.isAllowed = true; break; }
        case 'admin-list': { this.isAllowed = true; break; }
        case 'admin-edit/:id': { this.isAllowed = true; break; }
        case 'supervisor-create': { this.isAllowed = true; break; }
        case 'supervisor-list': { this.isAllowed = true; break; }
        case 'supervisor-edit/:id': { this.isAllowed = true; break; }
        case 'teller-create': { this.isAllowed = true; break; }
        case 'teller-list': { this.isAllowed = true; break; }
        case 'teller-edit/:id': { this.isAllowed = true; break; }
        case 'transaction-list': { this.isAllowed = true; break; }
        case 'cart': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
              }
      // this.auth.allowRoutes();
        return this.isAllowed;
    } else if (role === 5) {
      switch (route.routeConfig.path) {
        case 'dashboard': { this.isAllowed = true; break; }
        case 'items-create': { this.isAllowed = false; break; }
        case 'items-list': { this.isAllowed = true; break; }
        case 'items-edit/:id': { this.isAllowed = false; break; }
        case 'customer-create': { this.isAllowed = false; break; }
        case 'customer-list': { this.isAllowed = false; break; }
        case 'customer-edit/:id': { this.isAllowed = false; break; }
        case 'earnings-create': { this.isAllowed = false; break; }
        case 'earnings-list': { this.isAllowed = false; break; }
        case 'earnings-edit/:id': { this.isAllowed = false; break; }
        case 'campaign-create': { this.isAllowed = false; break; }
        case 'campaign-list': { this.isAllowed = true; break; }
        case 'campaign-edit/:id': { this.isAllowed = false; break; }
        case 'special-reward-create': { this.isAllowed = false; break; }
        case 'special-reward-list': { this.isAllowed = true; break; }
        case 'special-reward-edit/:id': { this.isAllowed = false; break; }
        case 'segment-create': { this.isAllowed = false; break; }
        case 'segment-list': { this.isAllowed = false; break; }
        case 'segment-edit/:id': { this.isAllowed = false; break; }
        case 'pos-create': { this.isAllowed = false; break; }
        case 'pos-list': { this.isAllowed = false; break; }
        case 'pos-edit/:id': { this.isAllowed = false; break; }
        case 'level-create': { this.isAllowed = false; break; }
        case 'level-list': { this.isAllowed = false; break; }
        case 'level-edit/:id': { this.isAllowed = false; break; }
        case 'localization-create': { this.isAllowed = false; break; }
        case 'localization-list': { this.isAllowed = false; break; }
        case 'localization-edit/:id': { this.isAllowed = false; break; }
        case 'merchant-create': { this.isAllowed = false; break; }
        case 'merchant-list': { this.isAllowed = false; break; }
        case 'merchant-edit/:id': { this.isAllowed = false; break; }
        case 'category-create': { this.isAllowed = false; break; }
        case 'category-list': { this.isAllowed = true; break; }
        case 'category-edit/:id': { this.isAllowed = false; break; }
        case 'admin-create': { this.isAllowed = false; break; }
        case 'admin-list': { this.isAllowed = false; break; }
        case 'admin-edit/:id': { this.isAllowed = false; break; }
        case 'supervisor-create': { this.isAllowed = false; break; }
        case 'supervisor-list': { this.isAllowed = false; break; }
        case 'supervisor-edit/:id': { this.isAllowed = false; break; }
        case 'teller-create': { this.isAllowed = false; break; }
        case 'teller-list': { this.isAllowed = false; break; }
        case 'teller-edit/:id': { this.isAllowed = false; break; }
        case 'transaction-list': { this.isAllowed = true; break; }
        case 'cart': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
        // case 'items-create': { this.isAllowed = true; break; }
        // case 'items-list': { this.isAllowed = true; break; }
        // case 'items-edit/:id': { this.isAllowed = true; break; }
              }
      // this.auth.allowRoutes();
        return this.isAllowed;
    } else {
      return false;
    }
  }
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const role = Number(localStorage.getItem('user_group'));
      // console.log(route.routeConfig);
      if (role === 1) {
        switch (route.routeConfig.path) {
          case 'dashboard': { this.isAllowed = true; break; }
          case 'items-create': { this.isAllowed = true; break; }
          case 'items-list': { this.isAllowed = true; break; }
          case 'items-edit/:id': { this.isAllowed = true; break; }
          case 'customer-create': { this.isAllowed = true; break; }
          case 'customer-list': { this.isAllowed = true; break; }
          case 'customer-edit/:id': { this.isAllowed = true; break; }
          case 'earnings-create': { this.isAllowed = true; break; }
          case 'earnings-list': { this.isAllowed = true; break; }
          case 'earnings-edit/:id': { this.isAllowed = true; break; }
          case 'campaign-create': { this.isAllowed = true; break; }
          case 'campaign-list': { this.isAllowed = true; break; }
          case 'campaign-edit/:id': { this.isAllowed = true; break; }
          case 'special-reward-create': { this.isAllowed = true; break; }
          case 'special-reward-list': { this.isAllowed = true; break; }
          case 'special-reward-edit/:id': { this.isAllowed = true; break; }
          case 'segment-create': { this.isAllowed = true; break; }
          case 'segment-list': { this.isAllowed = true; break; }
          case 'segment-edit/:id': { this.isAllowed = true; break; }
          case 'pos-create': { this.isAllowed = true; break; }
          case 'pos-list': { this.isAllowed = true; break; }
          case 'pos-edit/:id': { this.isAllowed = true; break; }
          case 'level-create': { this.isAllowed = true; break; }
          case 'level-list': { this.isAllowed = true; break; }
          case 'level-edit/:id': { this.isAllowed = true; break; }
          case 'localization-create': { this.isAllowed = true; break; }
          case 'localization-list': { this.isAllowed = true; break; }
          case 'localization-edit/:id': { this.isAllowed = true; break; }
          case 'merchant-create': { this.isAllowed = true; break; }
          case 'merchant-list': { this.isAllowed = true; break; }
          case 'merchant-edit/:id': { this.isAllowed = true; break; }
          case 'category-create': { this.isAllowed = true; break; }
          case 'category-list': { this.isAllowed = true; break; }
          case 'category-edit/:id': { this.isAllowed = true; break; }
          case 'admin-create': { this.isAllowed = true; break; }
          case 'admin-list': { this.isAllowed = true; break; }
          case 'admin-edit/:id': { this.isAllowed = true; break; }
          case 'supervisor-create': { this.isAllowed = true; break; }
          case 'supervisor-list': { this.isAllowed = true; break; }
          case 'supervisor-edit/:id': { this.isAllowed = true; break; }
          case 'teller-create': { this.isAllowed = true; break; }
          case 'teller-list': { this.isAllowed = true; break; }
          case 'teller-edit/:id': { this.isAllowed = true; break; }
          case 'transaction-list': { this.isAllowed = true; break; }
          case 'cart': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
                }
        // this.auth.allowRoutes();
          return this.isAllowed;
      } else if (role === 2) {
        switch (route.routeConfig.path) {
          case 'dashboard': { this.isAllowed = true; break; }
          case 'items-create': { this.isAllowed = true; break; }
          case 'items-list': { this.isAllowed = true; break; }
          case 'items-edit/:id': { this.isAllowed = true; break; }
          case 'customer-create': { this.isAllowed = true; break; }
          case 'customer-list': { this.isAllowed = true; break; }
          case 'customer-edit/:id': { this.isAllowed = true; break; }
          case 'earnings-create': { this.isAllowed = true; break; }
          case 'earnings-list': { this.isAllowed = true; break; }
          case 'earnings-edit/:id': { this.isAllowed = true; break; }
          case 'campaign-create': { this.isAllowed = true; break; }
          case 'campaign-list': { this.isAllowed = true; break; }
          case 'campaign-edit/:id': { this.isAllowed = true; break; }
          case 'special-reward-create': { this.isAllowed = true; break; }
          case 'special-reward-list': { this.isAllowed = true; break; }
          case 'special-reward-edit/:id': { this.isAllowed = true; break; }
          case 'segment-create': { this.isAllowed = true; break; }
          case 'segment-list': { this.isAllowed = true; break; }
          case 'segment-edit/:id': { this.isAllowed = true; break; }
          case 'pos-create': { this.isAllowed = true; break; }
          case 'pos-list': { this.isAllowed = true; break; }
          case 'pos-edit/:id': { this.isAllowed = true; break; }
          case 'level-create': { this.isAllowed = true; break; }
          case 'level-list': { this.isAllowed = true; break; }
          case 'level-edit/:id': { this.isAllowed = true; break; }
          case 'localization-create': { this.isAllowed = true; break; }
          case 'localization-list': { this.isAllowed = true; break; }
          case 'localization-edit/:id': { this.isAllowed = true; break; }
          case 'merchant-create': { this.isAllowed = true; break; }
          case 'merchant-list': { this.isAllowed = true; break; }
          case 'merchant-edit/:id': { this.isAllowed = true; break; }
          case 'category-create': { this.isAllowed = true; break; }
          case 'category-list': { this.isAllowed = true; break; }
          case 'category-edit/:id': { this.isAllowed = true; break; }
          case 'admin-create': { this.isAllowed = true; break; }
          case 'admin-list': { this.isAllowed = true; break; }
          case 'admin-edit/:id': { this.isAllowed = true; break; }
          case 'supervisor-create': { this.isAllowed = true; break; }
          case 'supervisor-list': { this.isAllowed = true; break; }
          case 'supervisor-edit/:id': { this.isAllowed = true; break; }
          case 'teller-create': { this.isAllowed = true; break; }
          case 'teller-list': { this.isAllowed = true; break; }
          case 'teller-edit/:id': { this.isAllowed = true; break; }
          case 'transaction-list': { this.isAllowed = true; break; }
          case 'cart': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
                }
        // this.auth.allowRoutes();
          return this.isAllowed;
      } else if (role === 3) {
        switch (route.routeConfig.path) {
          case 'dashboard': { this.isAllowed = true; break; }
          case 'items-create': { this.isAllowed = true; break; }
          case 'items-list': { this.isAllowed = true; break; }
          case 'items-edit/:id': { this.isAllowed = true; break; }
          case 'customer-create': { this.isAllowed = true; break; }
          case 'customer-list': { this.isAllowed = true; break; }
          case 'customer-edit/:id': { this.isAllowed = true; break; }
          case 'earnings-create': { this.isAllowed = true; break; }
          case 'earnings-list': { this.isAllowed = true; break; }
          case 'earnings-edit/:id': { this.isAllowed = true; break; }
          case 'campaign-create': { this.isAllowed = true; break; }
          case 'campaign-list': { this.isAllowed = true; break; }
          case 'campaign-edit/:id': { this.isAllowed = true; break; }
          case 'special-reward-create': { this.isAllowed = true; break; }
          case 'special-reward-list': { this.isAllowed = true; break; }
          case 'special-reward-edit/:id': { this.isAllowed = true; break; }
          case 'segment-create': { this.isAllowed = true; break; }
          case 'segment-list': { this.isAllowed = true; break; }
          case 'segment-edit/:id': { this.isAllowed = true; break; }
          case 'pos-create': { this.isAllowed = true; break; }
          case 'pos-list': { this.isAllowed = true; break; }
          case 'pos-edit/:id': { this.isAllowed = true; break; }
          case 'level-create': { this.isAllowed = true; break; }
          case 'level-list': { this.isAllowed = true; break; }
          case 'level-edit/:id': { this.isAllowed = true; break; }
          case 'localization-create': { this.isAllowed = true; break; }
          case 'localization-list': { this.isAllowed = true; break; }
          case 'localization-edit/:id': { this.isAllowed = true; break; }
          case 'merchant-create': { this.isAllowed = true; break; }
          case 'merchant-list': { this.isAllowed = true; break; }
          case 'merchant-edit/:id': { this.isAllowed = true; break; }
          case 'category-create': { this.isAllowed = true; break; }
          case 'category-list': { this.isAllowed = true; break; }
          case 'category-edit/:id': { this.isAllowed = true; break; }
          case 'admin-create': { this.isAllowed = true; break; }
          case 'admin-list': { this.isAllowed = true; break; }
          case 'admin-edit/:id': { this.isAllowed = true; break; }
          case 'supervisor-create': { this.isAllowed = true; break; }
          case 'supervisor-list': { this.isAllowed = true; break; }
          case 'supervisor-edit/:id': { this.isAllowed = true; break; }
          case 'teller-create': { this.isAllowed = true; break; }
          case 'teller-list': { this.isAllowed = true; break; }
          case 'teller-edit/:id': { this.isAllowed = true; break; }
          case 'transaction-list': { this.isAllowed = true; break; }
          case 'cart': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
                }
        // this.auth.allowRoutes();
          return this.isAllowed;
      } else if (role === 4) {
        switch (route.routeConfig.path) {
          case 'dashboard': { this.isAllowed = true; break; }
          case 'items-create': { this.isAllowed = true; break; }
          case 'items-list': { this.isAllowed = true; break; }
          case 'items-edit/:id': { this.isAllowed = true; break; }
          case 'customer-create': { this.isAllowed = true; break; }
          case 'customer-list': { this.isAllowed = true; break; }
          case 'customer-edit/:id': { this.isAllowed = true; break; }
          case 'earnings-create': { this.isAllowed = true; break; }
          case 'earnings-list': { this.isAllowed = true; break; }
          case 'earnings-edit/:id': { this.isAllowed = true; break; }
          case 'campaign-create': { this.isAllowed = true; break; }
          case 'campaign-list': { this.isAllowed = true; break; }
          case 'campaign-edit/:id': { this.isAllowed = true; break; }
          case 'special-reward-create': { this.isAllowed = true; break; }
          case 'special-reward-list': { this.isAllowed = true; break; }
          case 'special-reward-edit/:id': { this.isAllowed = true; break; }
          case 'segment-create': { this.isAllowed = true; break; }
          case 'segment-list': { this.isAllowed = true; break; }
          case 'segment-edit/:id': { this.isAllowed = true; break; }
          case 'pos-create': { this.isAllowed = true; break; }
          case 'pos-list': { this.isAllowed = true; break; }
          case 'pos-edit/:id': { this.isAllowed = true; break; }
          case 'level-create': { this.isAllowed = true; break; }
          case 'level-list': { this.isAllowed = true; break; }
          case 'level-edit/:id': { this.isAllowed = true; break; }
          case 'localization-create': { this.isAllowed = true; break; }
          case 'localization-list': { this.isAllowed = true; break; }
          case 'localization-edit/:id': { this.isAllowed = true; break; }
          case 'merchant-create': { this.isAllowed = true; break; }
          case 'merchant-list': { this.isAllowed = true; break; }
          case 'merchant-edit/:id': { this.isAllowed = true; break; }
          case 'category-create': { this.isAllowed = true; break; }
          case 'category-list': { this.isAllowed = true; break; }
          case 'category-edit/:id': { this.isAllowed = true; break; }
          case 'admin-create': { this.isAllowed = true; break; }
          case 'admin-list': { this.isAllowed = true; break; }
          case 'admin-edit/:id': { this.isAllowed = true; break; }
          case 'supervisor-create': { this.isAllowed = true; break; }
          case 'supervisor-list': { this.isAllowed = true; break; }
          case 'supervisor-edit/:id': { this.isAllowed = true; break; }
          case 'teller-create': { this.isAllowed = true; break; }
          case 'teller-list': { this.isAllowed = true; break; }
          case 'teller-edit/:id': { this.isAllowed = true; break; }
          case 'transaction-list': { this.isAllowed = true; break; }
          case 'cart': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
                }
        // this.auth.allowRoutes();
          return this.isAllowed;
      } else if (role === 5) {
        switch (route.routeConfig.path) {
          case 'dashboard': { this.isAllowed = true; break; }
          case 'items-create': { this.isAllowed = false; break; }
          case 'items-list': { this.isAllowed = true; break; }
          case 'items-edit/:id': { this.isAllowed = false; break; }
          case 'customer-create': { this.isAllowed = false; break; }
          case 'customer-list': { this.isAllowed = false; break; }
          case 'customer-edit/:id': { this.isAllowed = false; break; }
          case 'earnings-create': { this.isAllowed = false; break; }
          case 'earnings-list': { this.isAllowed = false; break; }
          case 'earnings-edit/:id': { this.isAllowed = false; break; }
          case 'campaign-create': { this.isAllowed = false; break; }
          case 'campaign-list': { this.isAllowed = true; break; }
          case 'campaign-edit/:id': { this.isAllowed = false; break; }
          case 'special-reward-create': { this.isAllowed = false; break; }
          case 'special-reward-list': { this.isAllowed = true; break; }
          case 'special-reward-edit/:id': { this.isAllowed = false; break; }
          case 'segment-create': { this.isAllowed = false; break; }
          case 'segment-list': { this.isAllowed = false; break; }
          case 'segment-edit/:id': { this.isAllowed = false; break; }
          case 'pos-create': { this.isAllowed = false; break; }
          case 'pos-list': { this.isAllowed = false; break; }
          case 'pos-edit/:id': { this.isAllowed = false; break; }
          case 'level-create': { this.isAllowed = false; break; }
          case 'level-list': { this.isAllowed = false; break; }
          case 'level-edit/:id': { this.isAllowed = false; break; }
          case 'localization-create': { this.isAllowed = false; break; }
          case 'localization-list': { this.isAllowed = false; break; }
          case 'localization-edit/:id': { this.isAllowed = false; break; }
          case 'merchant-create': { this.isAllowed = false; break; }
          case 'merchant-list': { this.isAllowed = false; break; }
          case 'merchant-edit/:id': { this.isAllowed = false; break; }
          case 'category-create': { this.isAllowed = false; break; }
          case 'category-list': { this.isAllowed = true; break; }
          case 'category-edit/:id': { this.isAllowed = false; break; }
          case 'admin-create': { this.isAllowed = false; break; }
          case 'admin-list': { this.isAllowed = false; break; }
          case 'admin-edit/:id': { this.isAllowed = false; break; }
          case 'supervisor-create': { this.isAllowed = false; break; }
          case 'supervisor-list': { this.isAllowed = false; break; }
          case 'supervisor-edit/:id': { this.isAllowed = false; break; }
          case 'teller-create': { this.isAllowed = false; break; }
          case 'teller-list': { this.isAllowed = false; break; }
          case 'teller-edit/:id': { this.isAllowed = false; break; }
          case 'transaction-list': { this.isAllowed = true; break; }
          case 'cart': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
          // case 'items-create': { this.isAllowed = true; break; }
          // case 'items-list': { this.isAllowed = true; break; }
          // case 'items-edit/:id': { this.isAllowed = true; break; }
                }
        // this.auth.allowRoutes();
          return this.isAllowed;
      } else {

        return false;
      }
  }

}
