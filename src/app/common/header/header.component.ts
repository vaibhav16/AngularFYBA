import { Component, OnInit,Input, ViewChild, ElementRef } from '@angular/core';
import { LoginService} from './../services/login.service';
import { Router } from   '@angular/router'; 
import { CommonService } from '../services/common.service';
import { FinalFilter } from '../..//models/official/select-game/finalFilter.model';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	apiModel: FinalFilter={
		UserID:'',
		SessionKey:'',
		RequestedData:''
	   }
	
	constructor(private _router: Router,
		public loginService: LoginService,
		public commonService: CommonService) { }
	@Input('topImage') topImage: string;
	@ViewChild('imageClass') imageClass: ElementRef;
	
	//@ViewChild('playerActive') playerActive: ElementRef;
	//@ViewChild('coachActive') coachActive: ElementRef;
	//@ViewChild('officialActive') officialActive: ElementRef;
	
	ngOnInit() {	
		//this.imageClass.nativeElement.classList.remove('player_header_img');
		//this.imageClass.nativeElement.classList.remove('official_header_img');
		//this.imageClass.nativeElement.classList.remove('coach_header_img');
		this.imageClass.nativeElement.classList.add(this.topImage);
		
		//this.playerActive.nativeElement.classList.remove('active'); 
		//this.coachActive.nativeElement.classList.remove('active'); 
		//this.officialActive.nativeElement.classList.remove('active');  
		
		if(this.topImage == 'player_header_img'){
			//this.playerActive.nativeElement.classList.add('active'); 
		}else if(this.topImage == 'coach_header_img'){
			//this.coachActive.nativeElement.classList.add('active'); 
		}else{
			//this.officialActive.nativeElement.classList.add('active'); 
		}
		
	}
	toggle:boolean=false
	toggleMenu(){
		this.toggle=!this.toggle;
	}

	logout(){
		this._router.navigate(['logout']);
	}

	changePassword(){
		this._router.navigate(['changepassword']);
	}
	
	//toggle:boolean=false
	TextSizeModel = {
		TextSize:''
	};
	
	toggleText(){	
		// var currentTxtSize = this.loginService.cookieService.get('textSize');
		// if(currentTxtSize=="Small")
		// this.TextSizeModel.TextSize = "Large";
		// else
		// this.TextSizeModel.TextSize = "Small";
		 //= txtSize.toString();
		//this.commonService.toggleTextSize();
		//this.commonService.toggleTextSize(JSON.stringify(this.TextSizeModel));
	
	}
	
}