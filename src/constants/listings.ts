
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
  // From UI ID to DB value (used when sending filter to API)
  idToDb: {
    'alimentos': 'Alimentos',
    'servicos': 'Serviços',
    'produtos': 'Produtos Gerais',
    'vagas': 'Vagas/Empregos'
  },
  // From DB value to UI ID (used when receiving data from API)
  dbToId: {
    'Alimentos': 'alimentos',
    'Serviços': 'servicos',
    'servicos': 'servicos',
    'Produtos Gerais': 'produtos',
    'produtos': 'produtos',
    'Vagas/Empregos': 'vagas',
    'vagas': 'vagas',
    // Add common variations for robustness
    'serviço': 'servicos',
    'servico': 'servicos',
    'produto': 'produtos',
    // Add lowercase variations for case insensitivity
    'alimentos': 'alimentos',
    'serviços': 'servicos'
  }
};
