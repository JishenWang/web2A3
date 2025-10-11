import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Event, Category, EventDetailData, Registration } from '../models/event.model';

@Injectable({
  providedIn: 'root' // Injected at root level to avoid circular dependencies
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Get all events list
   * Returns 5 mock events when backend API is abnormal
   */
  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`).pipe(
      catchError(this.handleError<Event[]>('getEvents', [
        { 
          id: 1, 
          title: 'Charity Run (Mock)', 
          description: 'Running event to raise funds for underprivileged children',
          start_date: '2025-10-15T08:00:00', 
          end_date: '2025-10-15T18:00:00',
          location: 'City Center Park',
          ticket_price: 25,
          category_id: 1,
          category: { id: 1, name: 'Charity Run', description: 'Running-based charity activities' },
          max_tickets: 100,
          created_at: '2025-10-01T00:00:00'
        },
        { 
          id: 2, 
          title: 'Charity Bazaar (Mock)', 
          description: 'Handicraft bazaar for donation activities',
          start_date: '2025-11-20T19:00:00', 
          end_date: '2025-11-20T22:00:00',
          location: 'City Exhibition Hall',
          ticket_price: 30,
          category_id: 2,
          category: { id: 2, name: 'Bazaar', description: 'Bazaar-based charity activities' },
          max_tickets: 200,
          created_at: '2025-10-02T00:00:00'
        },
        { 
          id: 3, 
          title: 'Charity Lecture (Mock)', 
          description: 'Public lecture on poverty alleviation and charity',
          start_date: '2025-12-05T14:00:00', 
          end_date: '2025-12-05T16:30:00',
          location: 'City Library Auditorium',
          ticket_price: 15,
          category_id: 3,
          category: { id: 3, name: 'Lecture', description: 'Knowledge-sharing charity activities' },
          max_tickets: 150,
          created_at: '2025-10-03T00:00:00'
        },
        { 
          id: 4, 
          title: 'Charity Gala Dinner (Mock)', 
          description: 'Formal dinner with charity auctions and performances',
          start_date: '2026-01-15T18:30:00', 
          end_date: '2026-01-15T22:00:00',
          location: 'Grand Hotel Ballroom',
          ticket_price: 150,
          category_id: 4,
          category: { id: 4, name: 'Gala', description: 'Formal charity events (e.g., dinners, galas)' },
          max_tickets: 300,
          created_at: '2025-10-04T00:00:00'
        },
        { 
          id: 5, 
          title: 'Volunteer Recruitment (Mock)', 
          description: 'Recruiting volunteers for upcoming charity projects',
          start_date: '2025-10-20T10:00:00', 
          end_date: '2025-10-20T13:00:00',
          location: 'Community Center',
          ticket_price: 0,
          category_id: 5,
          category: { id: 5, name: 'Volunteer', description: 'Volunteer recruitment activities' },
          max_tickets: 50,
          created_at: '2025-10-05T00:00:00'
        }
      ]))
    );
  }

  /**
   * Get single event by ID
   * Returns fully structured default event when API is abnormal
   */
  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`).pipe(
      catchError(this.handleError<Event>(`getEventById id=${id}`, {
        id: id,
        title: 'Default Event (Mock)',
        description: 'Event data temporarily unavailable',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        location: 'Unknown location',
        ticket_price: 0,
        category_id: 0,
        category: { id: 0, name: 'Default Category', description: 'Default category description' },
        max_tickets: 0,
        created_at: new Date().toISOString()
      }))
    );
  }

  /**
   * Get event details (including registration data)
   * Returns default detail data when API is abnormal
   */
  getEventDetail(id: number): Observable<EventDetailData> {
    return this.http.get<EventDetailData>(`${this.apiUrl}/events/${id}/detail`).pipe(
      catchError(this.handleError<EventDetailData>(`getEventDetail id=${id}`, {
        event: {
          id: id,
          title: 'Detail Event (Mock)',
          description: 'Event details temporarily unavailable',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          location: 'Unknown detail location',
          ticket_price: 0,
          category_id: 0,
          category: { id: 0, name: 'Detail Default Category', description: 'Category description' },
          max_tickets: 0,
          created_at: new Date().toISOString()
        },
        registrations: []
      }))
    );
  }

  /**
   * Create new event
   * Returns empty event structure when API is abnormal (to prevent component crash)
   */
  createEvent(event: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event).pipe(
      catchError(this.handleError<Event>('createEvent', {
        id: 0,
        title: '',
        description: '',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        location: '',
        ticket_price: 0,
        category_id: 0,
        category: { id: 0, name: '', description: '' },
        max_tickets: 0,
        created_at: new Date().toISOString()
      } as Event))
    );
  }

  /**
   * Update event
   * Returns empty event structure when API is abnormal (to prevent component crash)
   */
  updateEvent(id: number, event: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/events/${id}`, event).pipe(
      catchError(this.handleError<Event>(`updateEvent id=${id}`, {
        id: id,
        title: '',
        description: '',
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        location: '',
        ticket_price: 0,
        category_id: 0,
        category: { id: 0, name: '', description: '' },
        max_tickets: 0,
        created_at: new Date().toISOString()
      } as Event))
    );
  }

  /**
   * Delete event
   * Returns empty (no side effects) when API is abnormal
   */
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`).pipe(
      catchError(this.handleError<void>(`deleteEvent id=${id}`))
    );
  }

  /**
   * Get all categories
   * Returns mock category array (matching 5 event categories) when API is abnormal
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError<Category[]>('getCategories', [
        { id: 1, name: 'Charity Run', description: 'Running-based charity events' },
        { id: 2, name: 'Bazaar', description: 'Bazaar-based charity events' },
        { id: 3, name: 'Lecture', description: 'Knowledge sharing events' },
        { id: 4, name: 'Gala', description: 'Formal charity events (e.g., dinners, galas)' },
        { id: 5, name: 'Volunteer', description: 'Volunteer recruitment activities' }
      ]))
    );
  }

  /**
   * Unified error handling: print logs + return default values (ensure component logic doesn't break)
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`[API Error] ${operation} failed:`, error);
      return of(result as T);
    };
  }
}