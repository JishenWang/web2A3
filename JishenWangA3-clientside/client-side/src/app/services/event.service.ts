import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, Category, Registration, ApiResponse } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getHomeEvents(): Observable<ApiResponse<Event[]>> {
    return this.http.get<ApiResponse<Event[]>>(`${this.apiBaseUrl}/api/events/home`);
  }

  getEventById(id: number): Observable<ApiResponse<Event>> {
    return this.http.get<ApiResponse<Event>>(`${this.apiBaseUrl}/api/events/${id}`);
  }

  searchEvents(params: any): Observable<ApiResponse<Event[]>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<ApiResponse<Event[]>>(`${this.apiBaseUrl}/api/events/search`, { params: httpParams });
  }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiBaseUrl}/api/categories`);
  }

  registerForEvent(registration: Registration): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiBaseUrl}/api/registrations`, registration);
  }

  getEventRegistrations(eventId: number): Observable<ApiResponse<Registration[]>> {
    return this.http.get<ApiResponse<Registration[]>>(`${this.apiBaseUrl}/api/events/${eventId}/registrations`);
  }
}