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
  type?: string,
  country?: ICountriesResponseItem,
  code?: string,
  inBasket?: boolean
}

export interface ITours {
  tours: ITour[]
}

export interface ICountriesResponseItem {
  iso_code2: string,
  iso_code3: string,
  name_ru: string,
  flag_url: string,
}

export interface ITourType {
  key: string;
  label: string;
}

export interface ILocation {
  lat: number,
  lng: number
}

export type Coords = {
  latlng: [
    number,
    number
  ]
}
