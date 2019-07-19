export class APIPlayerScorePost {
    public GameId: string;
    public PlayerName?: string;
    public PlayerSeasonalId: string;
    public FoulId: string;
    public Points: number;
    public PlayerNote: boolean;
    public NotPresent: boolean;
    public Rebound: string;
    public TeamId: string;
    public TeamName: string;
  
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
  