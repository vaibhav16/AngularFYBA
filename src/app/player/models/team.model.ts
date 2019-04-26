export interface Team {
    Error: string;
    IsEncrypted: boolean;
    Message: string;
    SessionKey: string;
    Value: Value;
  }
  export interface Value {
    TeamGames: Array<TeamGames>;
    TeamLeaders: Array<TeamLeaders>;
    TeamName: string;
    TeamPractices: Array<TeamPractices>;
    TeamRoster: Array<TeamRoster>;
  }

export interface TeamGames {
    GameDate: string;
    GameStatus: string;
    GameTime: string;
    HomeTeam: string;
    Location: string;
    VisitingTeam: string;
}

  export interface TeamLeaders{
    Email:string;
    Photo: string;
    VolunteerName: string;
    VolunteerPosition: string;
    selected: boolean;
  }
  
  export interface TeamPractices{
    Location: string;
    PracticeDate: string;
    PracticeStatus: string;
    PracticeTime: string;
  }

  export interface TeamRoster{
    JerseyNumber: string;
    Parents: Array<Parents>;
    Photo: string;
    PlayerName: string;
  }

  export interface Parents{
    ParentEmail: string;
    ParentHomePhone: string;
    ParentMobilePhone: string;
    ParentName: string;
    ParentRelationship: string;
    ParentWorkPhone: string;
  }
  