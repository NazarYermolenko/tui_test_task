export interface SearchCriteria {
  departureAirport?: string | 'first' | 'random';
  destination?: string | 'first' | 'random';
  departureDate?: string | 'first' | 'random';
  rooms?: {
    adultsCount: number;
    childrenCount: number;
    childrenAges: string[];
  };
}
