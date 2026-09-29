export type Currency = 'INR' | 'USD';

export interface ShoppingLinks {
  [platform: string]: string;
}

export interface HomeItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface HomeCategoryBreakdown {
  category: string;
  allocation: number;
  items: HomeItem[];
}

export interface CalculationTableRow {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface HomeRecommendationResult {
  total_budget: number;
  remaining_budget: number;
  currency?: string;
  budget_breakdown: HomeCategoryBreakdown[];
  calculation_table?: CalculationTableRow[];
  additional_suggestions: string[];
}

export interface PartyItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface PartyCategoryBreakdown {
  category: string;
  allocation: number;
  items: PartyItem[];
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity: number;
  estimated_cost: number;
  location?: string;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface PartyRecommendationResult {
  total_budget: number;
  allocated_budget?: number;
  remaining_budget: number;
  currency?: string;
  budget_breakdown: PartyCategoryBreakdown[];
  venue_suggestions: VenueSuggestion[];
  calculation_table_inr?: CalculationTableRow[];
  additional_suggestions: string[];
}

export interface OutfitAnalysis {
  colors: string[];
  style: string;
  formality: string;
  summary?: string;
}

export interface JewelryItem {
  item_type: string;
  description: string;
  style: string;
  estimated_price: number;
  search_terms: string;
  shopping_links: Record<string, string>;
}

export interface JewelryRecommendationResult {
  total_budget: number;
  remaining_budget: number;
  currency?: string;
  outfit_analysis?: OutfitAnalysis;
  jewelry_recommendations: JewelryItem[];
  styling_tips: string[];
}

export interface RecommendationHistoryItem {
  id: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  input_summary: Record<string, any>;
  result_summary: {
    total_budget: number;
    remaining_budget: number;
    item_count: number;
    highlight: string;
  };
  full_result: any;
}

export interface User {
  username: string;
  email: string;
  full_name?: string;
}

export interface SessionInfo {
  username: string;
  login_time: string;
  last_activity: string;
  session_duration: number;
  user_data: Record<string, any>;
}
