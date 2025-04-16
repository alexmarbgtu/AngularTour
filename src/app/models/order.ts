export interface IOrderData {
  firstName: string,
  lastName: string,
  cardNumber: number,
  birthDate: Date,
  age: number,
  citizenship: string
}

export interface IOrder {
  userLogin: string;
  tourId: string;
  personalData: IOrderData[]
}
