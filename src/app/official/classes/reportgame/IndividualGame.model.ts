export class IndividualGame {
  public Roleid: string;
  public SeasonId: string;
  public OfficialSeasonId: string;
  public OfficiatingPositionId: string;
  public IsHomeForfeit:boolean;
  public IsVisitorForfeit:boolean;
  public GameId: string;
  public GameName: string;
  public GameDate: string;
  public Location: string;
  public GameStartTime: string;
  public HomeTeam: string;
  public VisitingTeam: string;
  public HomeTeamId: string;
  public VisitingTeamId: string;
  public HomeTeamScore: string;
  public VisitingTeamScore: string;
  public Division: string;
  public LeagueId: string;
  public TotalGamePON:number;
  public TotalHomePON:number;
  public TotalVisitingPON: number;
  public PrePrintedScoresheetPdf:string;
  public HomeTeamPlayerScores: HomeTeamPlayerScores[];
  public VisitingTeamPlayerScores: VisitingTeamPlayerScores[];
  public ScoreSheetImages: ScoreSheetImages[];
  public DeletedScoreSheetImages: DeletedScoreSheetImages[];
  public IncidentReports: IncidentReports[]; 
  public DeleteIncidentReport : DeleteIncidentReport[];

  constructor() {
    this.SeasonId = "";
    this.OfficialSeasonId = "";
    (this.Roleid = ""),
      (this.GameId = ""),
      (this.GameId = ""),
      (this.HomeTeamId = ""),
      (this.VisitingTeamId = ""),
      (this.HomeTeamScore = ""),
      (this.VisitingTeamScore = ""),
      (this.LeagueId = "");
  }
}


export class IncidentReports {
  public IncidentId: number;
  public GameId: number;
  public IncidentType : number;
  public IncidentValue: number;
  public Notes: string;

  constructor() {
    this.IncidentId = null;
    this.GameId = null;
    this.IncidentType = null;
    this.IncidentValue = null;
    this.Notes = '';
  }
}

export class DeleteIncidentReport {
  public IncidentId: number;
  public GameId: number;
  public IncidentType : number;
  public IncidentValue: number;
  public Notes: string;

  constructor() {
    this.IncidentId = null;
    this.GameId = null;
    this.IncidentType = null;
    this.IncidentValue = null;
    this.Notes = '';
  }
}
export class HomeTeamPlayerScores {
  public JersyNumber:string;
  public GameId: string;
  public PlayerName?: string;
  public PlayerSeasonalId: string;
  public FoulId: string;
  public Points: number;
  public PlayerNote: boolean;
  public NotPresent: boolean;
  public TeamId: string;
  public TeamName: string;
  public Rebound: string;

  constructor() {
    this.GameId = "";
    this.PlayerName = "";
    this.PlayerSeasonalId = "";
    this.FoulId = "";
    this.Points = null;
    this.PlayerNote = null;
    this.NotPresent = null;
    this.Rebound = "";
    this.TeamId = "";
    this.TeamName = "";
  }
}

export class VisitingTeamPlayerScores {
  public JersyNumber:string;
  public GameId: string;
  public PlayerName?: string;
  public PlayerSeasonalId: string;
  public FoulId: string;
  public Points: number;
  public PlayerNote: boolean;
  public NotPresent: boolean;
  public TeamId: string;
  public TeamName: string;
  public Rebound: string;

  constructor() {
    this.GameId = "";
    this.PlayerName = "";
    this.PlayerSeasonalId = "";
    this.FoulId = "";
    this.Points = null;
    this.PlayerNote = null;
    this.NotPresent = null;
    this.Rebound = "";
    this.TeamId = "";
    this.TeamName = "";
  }
}

export class ScoreSheetImages {
  public ImageURL: string;
  public NewImageByteCode: string;

  constructor() {
    this.ImageURL = "";
    this.NewImageByteCode = "";
  }
}

export class DeletedScoreSheetImages {
  public ImageURL: string;
  public NewImageByteCode: string;

  constructor() {
    this.ImageURL = "";
    this.NewImageByteCode = "";
  }
}
