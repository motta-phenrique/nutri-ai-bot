export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string; // ou Date, se você fizer o parse
  active_plan: boolean;
}