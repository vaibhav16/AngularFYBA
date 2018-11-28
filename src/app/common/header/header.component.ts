import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { LoginService} from '../../login/login.service';
import { Router } from   '@angular/router'; 

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	
	constructor(private _router: Router,public loginService: LoginService) { }
	@Input('topImage') topImage: string;
	@ViewChild('imageClass') imageClass: ElementRef;
	
	@ViewChild('playerActive') playerActive: ElementRef;
	@ViewChild('coachActive') coachActive: ElementRef;
	@ViewChild('officialActive') officialActive: ElementRef;
	
	ngOnInit() {  
		/*if(!this.loginService.sessionKey){
			this._router.navigate(['login']);
		}*/
		this.imageClass.nativeElement.classList.remove('player_header_img');
		this.imageClass.nativeElement.classList.remove('official_header_img');
		this.imageClass.nativeElement.classList.remove('coach_header_img');
		this.imageClass.nativeElement.classList.add(this.topImage);
		
		this.playerActive.nativeElement.classList.remove('active'); 
		this.coachActive.nativeElement.classList.remove('active'); 
		this.officialActive.nativeElement.classList.remove('active');  
		
		if(this.topImage == 'player_header_img'){
			this.playerActive.nativeElement.classList.add('active'); 
		}else if(this.topImage == 'coach_header_img'){
			this.coachActive.nativeElement.classList.add('active'); 
		}else{
			this.officialActive.nativeElement.classList.add('active'); 
		}
		
	}
	
}