
export interface Rating {
  id: string;
  rated_user_id: string;
  reviewer_id: string;
  ad_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface UserRatingSummary {
  average_rating: number;
  total_ratings: number;
}
