import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Registration } from '../models/event.model';  // 修正导入路径

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events`);
  }

  getEventById(id: number): Observable<{ event: Event, registrations: Registration[] }> {
    return this.http.get<{ event: Event, registrations: Registration[] }>(`${this.apiUrl}/events/${id}`);
  }

  createEvent(event: Omit<Event, 'event_id' | 'created_at'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/events`, event, { 
      headers: this.getHeaders() 
    });
  }

  updateEvent(id: number, event: Partial<Event>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/events/${id}`, event, { 
      headers: this.getHeaders() 
    });
  }

  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/events/${id}`);
  }
}