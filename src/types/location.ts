
export interface State {
  id: string;
  name: string;
  uf: string;
}

export interface City {
  id: string;
  name: string;
  state_id: string;
  states?: State; // Optional nested state data
}

export interface Condominium {
  id: string;
  name: string;
  city_id: string;
  address?: string;
  approved: boolean;
  cities?: City & { 
    states?: State 
  }; // Optional nested city data with state
}

export interface LocationFormData {
  stateId: string;
  cityId: string;
  condominiumId: string;
  newCondominium?: {
    name: string;
    address?: string;
  };
}
