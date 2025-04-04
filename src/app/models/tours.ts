export interface ITour {
  id: string,
  name: string,
  description: string,
  tourOperator: string,
  price: string,
  img: string,
  locationId: string,
  data?: string,
  date?: string,
  type?: string
}

export interface ITours {
  tours: ITour[]
}

export interface TourType {
  key: string;
  label: string;
}
