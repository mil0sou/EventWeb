export interface LoginResponse {
    token: string;
}

export interface User {
    id: string;
    username: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  event_date: string;   // ISO ou "YYYY-MM-DD"
  capacity: number;
  organizer: string;    // username (si ton back renvoie ça)
  remaining?: number;
  isRegistered?: boolean;

}
