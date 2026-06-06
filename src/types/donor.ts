export interface Donor {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  organization_id: number;
  created_at: string;
  cancelled_date: string;
  cancelled_reason: string;
}