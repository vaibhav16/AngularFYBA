export class APIPlayerScorePost{

    public GameId : string
    public PlayerName ?: string
    public PlayerSeasonalId : string
    public FoulId : string
    public Points : number
    public PlayerNote : boolean
    public TeamId : string

    constructor() {
        this.GameId = '';
        this.PlayerName = '';
        this.PlayerName = '';
        this.FoulId = '';
        this.Points = null;
        this.PlayerNote = null;
        this.TeamId = '';
     }

}