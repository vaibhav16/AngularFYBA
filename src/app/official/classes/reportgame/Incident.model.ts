export class IncidentReports {
    public IncidentId: number;
    public GameId: number;
    public IncidentType: number;
    public IncidentValue: number;
    public Notes: string;

    static create(event: {
        IncidentId: number;
        GameId: number;
        IncidentType: number;
        IncidentValue: number;
        Notes: string;
    }) {
        return {
            IncidentId: event.IncidentId,
            GameId: event.GameId,
            IncidentType: event.IncidentType,
            IncidentValue: event.IncidentValue,
            Notes: event.Notes
        };
    }
}
