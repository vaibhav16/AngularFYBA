import { Component, OnInit } from '@angular/core';
import { Http, Response} from '@angular/http';
import { map } from 'rxjs/operators';
import { OfficialService } from './official.service';


@Component({
  selector: 'app-official',
  templateUrl: './official.component.html',
  styleUrls: ['./official.component.css']
})
export class OfficialComponent implements OnInit {
  //selectedClass:string;
  selectGameJson:JSON;
  isSelectGameActive:boolean=false;

 

  constructor(private http: Http, private officialService: OfficialService) {
    //this.selectGameJson = this.officialService.getSelectGames();
   }

  ngOnInit() {
    this.isSelectGameActive=true;
  }

  selectGameData(){
    if(this.selectGameJson===null){
      this.selectGameJson = this.officialService.getSelectGames();
      
    }
    

  }


}
