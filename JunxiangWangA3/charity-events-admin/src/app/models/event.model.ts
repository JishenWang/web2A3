export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Registration {
  id: number;
  user_name: string;
  user_email: string;
  registration_date: string;
  ticket_count: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string; // 原 `event_date` 改为 `start_date`，与数据库/逻辑对齐
  end_date: string;
  location: string;
  ticket_price: number;
  category_id: number;
  category: Category;
  max_tickets: number;
  created_at: string;
}

export interface EventDetailData {
  event: Event;
  registrations: Registration[];
}