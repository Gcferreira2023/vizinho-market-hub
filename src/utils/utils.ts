
// Utility functions for the application

/**
 * Translates a database status string to a user-friendly Portuguese status
 * @param status The status from the database
 * @returns Localized status string
 */
export const translateStatusToPortuguese = (status: string): string => {
  switch (status) {
    case 'active':
      return 'disponível';
    case 'reserved':
      return 'reservado';
    case 'sold':
      return 'vendido';
    default:
      return 'disponível';
  }
};
