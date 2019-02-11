export interface IUserData {
    Error: string;
    IsEncrypted: boolean;
    Message: Message;
    SessionKey: string;
    Status:boolean;
    Value: Value;
  }

  export interface Message{
    PopupHeading: string;
    PopupMessage: string;
  }
  
  export interface Value {
    CoachId:string;
    CoachIsCoach:boolean;
    CoachSeasonalId:string;
    CoachStatusId:number;
    Email:string;
    FirstName:string;
    LastName:string;
    LastSelectedSeasonId:number;
    LeagueId:number;
    OfficialId:string;
    OfficialIsOfficial:boolean;
    OfficialSeasonalId:string;
    OfficialStatusId:number;
    PlayerIsPlayer:boolean;
    PlayerSeasonalInfoId:string;
    PlayerStatusId:number;
    PlayerlId:string ;
    PromptChangePassword:string;
    RandomKey:string;
    RoleId:number;
    RoundThumbnail:string;
    SeasonId:number;
    Text_Size:string;
    UserId:number;
    tagsLables: tagsLables;

  }

  export interface tagsLables{
    ReportCount: number;
  }

  