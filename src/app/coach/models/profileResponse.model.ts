export interface CoachProfileResponse{
    Error:number;
    Message: Message;
    Value: Value;
    SessionKey:string;
    Status: true;
}

export interface Message{
    PopupHeading: string;
    PopupMessage: string;
}

export interface Value{
    CoachName: string;
    Email: string;
    HomePhone: string;
    WorkPhone: string;
    MobilePhone: string;
    Address: string;
    DateFingerPrinted: string;
    TeamName: string;
    TeamId: number;
    TimeslotName: string;
    AssignedFacility: string;
    AssignedTimeOfDay: string;
    AssignedDayOfWeek: string;
    LocationPreferenceValues: Array<LocationPreferenceValues>;
    LocationRankValues: Array<LocationRankValues>;
    DayOfTheWeekRankValues: Array<DayOfTheWeekRankValues>;
    TimeOfDayRankValues: Array<TimeOfDayRankValues>;
    DaysYouCannotHavePracticeValues: Array<DaysYouCannotHavePracticeValues>;
    DayOfTheWeekPreferenceValues: Array<DayOfTheWeekPreferenceValues>;
    TimeYouCannotHavePracticeValues: Array<TimeYouCannotHavePracticeValues>;
    TimeOfDayPreferenceValues: Array<TimeOfDayPreferenceValues>;
    ShirtSizeValue: Array<ShirtSizeValue>;
    
}

export interface LocationPreferenceValues{
    LocationId: number;
    LocationName: string;
    Selected:boolean;
}

export interface LocationRankValues{
    RankId: number;
    RankName: string;
    Selected: boolean;

}

export interface DayOfTheWeekRankValues{
    RankId: number;
    RankName: string;
    Selected: boolean;
}

export interface TimeOfDayRankValues{
    RankId: number;
    RankName: string;
    Selected: boolean;
}

export interface DaysYouCannotHavePracticeValues{
    DayId: number;
    DayName: string;
    Selected: boolean;
}

export interface DayOfTheWeekPreferenceValues{
    DayId: number;
    DayName: string;
    Selected: boolean;
}

export interface TimeYouCannotHavePracticeValues{
    TimeId: number;
    Time: string;
    Selected: boolean;
}

export interface TimeOfDayPreferenceValues{
    TimeId: number;
    Time: string;
    Selected: boolean;
}

export interface ShirtSizeValue{
    SizeId: number;
    Size: string;
    Selected: boolean;
}