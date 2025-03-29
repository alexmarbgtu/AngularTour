export interface ITour {
  id: string,
  name: string,
  description: string,
  tourOperator: string,
  price: string,
  img: string,
  locationId: string,
  data?: string,
  type?: string
}

export interface ITours {
  tours: ITour[]
}
