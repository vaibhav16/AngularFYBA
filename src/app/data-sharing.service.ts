import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class DataSharingService {
  constructor() {}
  textSize: string = null;
  initialFetchError: boolean = null;
}
