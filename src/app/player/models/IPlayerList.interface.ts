export interface IPlayerList {
  Error: string;
  IsEncrypted: boolean;
  Message: string;
  SessionKey: string;
  Value: Array<PlayerList>;
}
export interface PlayerList {
  PlayerId: number;
  PlayerFirstName: string;
  PlayerLastName: string;
  PlayerPhoto: string;
}
