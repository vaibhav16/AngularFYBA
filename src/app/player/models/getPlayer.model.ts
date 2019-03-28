export class GetPlayer {
  UserID: number;
  SessionKey: string;
  RequestedData: string;
  constructor() {
    this.UserID = null;
    this.SessionKey = '';
    this.RequestedData = '';
  }
}

// export class RequestedData {
//   LeagueId: number;
//   SeasonId: number;
//   constructor() {
//     this.LeagueId = null;
//     this.SeasonId = null;
//   }
// }
