export interface IPaidSection {
    Error: string;
    IsEncrypted: boolean;
    Message: string;
    SessionKey: string;
    Value: Value;
  }
  
  export interface Value {
    PaidPayments: Array<PaidPayments>;
    PaidPaymentsTotalAmount: string;
    PaymentNotApproved: Array<PaymentNotApproved>;
    PaymentNotPaid:Array<PaymentNotPaid>;
    PaymentNotPaidTotalAmount:string;
    SchedulePayments:Array<string>
  }

  export interface PaidPayments{
    BaseAmount:string;
    GameId:string;
    GameName:string;
    IncentiveAmount:string;
    OfficiatingPositionId:string;
    OfficiatingPositionText:string;
    TotalAmount:string; 
}

  export interface PaymentNotApproved{
    BaseAmount:string;
    GameId:string;
    GameName:string;
    IncentiveAmount:string;
    OfficiatingPositionId:string;
    OfficiatingPositionText:string;
    TotalAmount:string;   
  }

  export interface PaymentNotPaid{
    BaseAmount:string;
    GameId:string;
    GameName:string;
    IncentiveAmount:string;
    OfficiatingPositionId:string;
    OfficiatingPositionText:string;
    TotalAmount:string; 
}