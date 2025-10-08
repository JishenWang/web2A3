 export interface Event {
  event_id?: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location: string;
  category_id: number;
  max_tickets: number;
  created_at?: string;
  registration_count?: number;
}

export interface Registration {
  registration_id: number;
  event_id: number;
  user_name: string;
  user_email: string;
  registration_date: string;
  ticket_count: number;
  contact_details: string;
}

export interface Category {
  category_id: number;
  category_name: string;
}