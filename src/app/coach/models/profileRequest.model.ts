

export class CoachProfileRequest{
    UserID: number;
    SessionKey: string;
    RequestedData: string;
}

export class RequestedData{
    LeagueId: number;
    SeasonId: number;
    VolunteerSeasonalId: number;
    VolunteerId: number;
}