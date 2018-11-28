export class UploadProfileImage{    
    public LeagueId: string;
    public SeasonId: string;
    public Page: string;
    public Files: File[];

    constructor(){   
        this.Page = '';
        this.LeagueId = '';
        this.SeasonId = '';
        this.Files = []
    }

 }