export class IEmail{
    UserID:number;
    SessionKey:string;
    RequestedData:string;
    constructor(){
        this.UserID = null;
        this.SessionKey = '';
        this.RequestedData = '';
        
    }
}
export class RequestedData{
    ToEmailIds:string;
    FromEmailId:string;
    Subject:string;
    Body:string;
    SeasonId:string;
    LeagueId:string;

    constructor(){
        this.ToEmailIds = '';
        this.FromEmailId = '';
        this.Subject = '';
        this.Body = '';
        this.SeasonId = '';
        this.LeagueId = '';
    }
}
export interface CoachTeam {
    blasttype: string;
    
    }