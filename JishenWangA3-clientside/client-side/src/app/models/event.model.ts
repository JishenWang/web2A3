export interface Event {
  id: number;
  title: string;
  category_id: number;
  category_name: string;
  event_date: string;
  location: string;
  latitude?: number;
  longitude?: number;
  image_url: string;
  short_description: string;
  full_description: string;
  ticket_price: number;
  goal_amount: number;
  current_amount: number;
  status: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Registration {
  id?: number;
  event_id: number;
  user_name: string;
  user_email: string;
  phone: string;
  ticket_quantity: number;
  registration_date: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface WeatherData {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}