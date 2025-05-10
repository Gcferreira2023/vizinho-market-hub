
// Categories and types available in the system
export const categories = [
  { id: "alimentos", name: "Alimentos" },
  { id: "servicos", name: "Serviços" },
  { id: "produtos", name: "Produtos Gerais" },
  { id: "vagas", name: "Vagas/Empregos" },
];

export const listingTypes = [
  { id: "produto", name: "Produto" },
  { id: "serviço", name: "Serviço" },
];

// Map to translate between database values and UI values
export const categoryMappings = {
  // From UI ID to DB value
  idToDb: {
    'alimentos': 'Alimentos',
    'servicos': 'Serviços',
    'produtos': 'Produtos Gerais',
    'vagas': 'Vagas/Empregos'
  },
  // From DB value to UI ID
  dbToId: {
    'Alimentos': 'alimentos',
    'Serviços': 'servicos',
    'Produtos Gerais': 'produtos',
    'Vagas/Empregos': 'vagas'
  }
};
