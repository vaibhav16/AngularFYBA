export interface IProfileSection {
    Error: string;
    IsEncrypted: boolean;
    Message: string;
    SessionKey: string;
    Value: Array<Value>;
  }
  
  export interface Value {
    ApprovedOfficiatingDivisions: ApprovedOfficiatingDivisions;
    DataPrivacy: DataPrivacy;
    LeagueSettings: LeagueSettings;
    Payments:Array<paymentLists>;
    ProfileName:string;
    ProfileRating:string;
    PersonalInfo:PersonalInfo;
  }

  export interface ApprovedOfficiatingDivisions {
    approvedOfficiatingDivisionsLists:Array<approvedOfficiatingDivisionsLists>;
}


export interface DataPrivacy {
    PrivacyText:string;
}


export interface approvedOfficiatingDivisionsLists {
    Division: string;
    Referee: boolean;
    Scorekeeper: boolean;
    Umpire:boolean;
}

  export interface LeagueSettings{
    MaxGamesPerDay:number;
    MaxSeasonEarnings:string;  
  }

  export interface paymentLists{
 
}

export interface PersonalInfo{
    Address: string;
    Email: string;
    HomePhone: string;
    MobilePhone: string;
    profilePhotos:Array<profilePhotos>;
}

export interface profilePhotos{
    AltText: string;
    CreatedDate: string;
    Link: string;
    RoundThumbnail: string;
    Thumbnail: string;
}