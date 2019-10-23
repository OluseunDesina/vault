import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { appConfig } from '../../app.config';

@Injectable()
export class OrderService implements OnDestroy {
  constructor(private http: HttpClient, public cookieService: CookieService) { }

  private serviceUrl: string = 'vault/????/';
  private apiUrl = appConfig.apiUrl+this.serviceUrl;
  public apiItems: any[];

  public isLoaded: boolean = false;

  public staffFilterTerm: string = '';

  public selectedMeal: any;
  public companyListItems: any[];
  public selectedStaffMember: any;

  public userGroup = null;

  //public isComp = false;
  //public currentUserID = Number(this.cookieService.get('user_id'));

  public basket: any[] = [];
  public basketCount: number = 0;
  public basketTotal: number = 0;

  public countCompleted: boolean = false;

  public exampleBasket = [
    {id: 1, name: 'Chicken', total: 500, quantity: 4},
    {id: 2, name: 'Meat Pie', total: 350, quantity: 2},
    {id: 3, name: 'Coke', total: 150, quantity: 6},
  ]

  public countBasketItems(){
    this.countCompleted = false;
    this.basketCount = 0;
    this.basketTotal = 0;
    for(let i = 0; i < this.basket.length; i++) {
      this.basketCount++;
      this.basketTotal+=this.basket[i].total
    }
    this.countCompleted = true;
    return this.basketCount;
  }

  ngOnDestroy() {
    this.basket = [];
    this.basketCount = 0;
    this.basketTotal = 0;
  }

  //Make sure there is a separate basket view displayed somewhere at almost all times. Likely in the sidebar, dashboard, navbar or something.
  
  //The basket would have to be posted or patched to a particular url. It is likely going to be the transaction list. or rather to be more clear,
  //posting to the transaction list is likely going to be a crucial part of posting and order. it's not going to be easy.
  
  //Speaking of ordering, how are we going to add food items to the cart. I am thinkinf something like...click on the food item and then when u
  //see the mini page that shows the food details, click a button that says add to cart. This will actually add it to the service.

}
