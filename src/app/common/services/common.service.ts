import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Constants } from '../models/constants';
import { map } from 'rxjs/operators';
import { FinalFilter } from '../../models/official/select-game/finalFilter.model';
import { LoginService } from './login.service';
//import { DataSharingService } from './../datasharing.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

}
