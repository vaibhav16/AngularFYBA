import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoginService } from './../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public loginService: LoginService,private router: Router) {

   }

  ngOnInit() {
    this.loginService.cookieService.deleteAll();
  }

  ngAfterViewInit(){
    if (!this.loginService.cookieService.check('sessionKey')) { 
      this.router.navigate(['login']);
    }
    else{
      this.loginService.cookieService.deleteAll();
      this.router.navigate(['login']);

    }
     
  }
}
