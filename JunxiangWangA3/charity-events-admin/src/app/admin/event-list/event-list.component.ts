import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // 新增 RouterModule 导入
import { EventService } from '../../services/event.service'; 
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule] // 新增 RouterModule 导入（模板若用 routerLink 必需）
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';
  deleteMessage = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
        console.error('Error loading events:', error);
      }
    });
  }

  createNewEvent(): void {
    this.router.navigate(['/admin/events/new']);
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/admin/events/edit', eventId]);
  }

  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.deleteMessage = 'Event deleted successfully.';
          this.loadEvents(); // Reload list after deletion
          setTimeout(() => this.deleteMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          // 优化：使用可选链避免深层访问导致的 undefined 错误
          this.error = error?.error?.error?.includes('existing registrations') 
            ? 'Cannot delete event with existing registrations.' 
            : 'Failed to delete event. Please try again.';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  // 修正：注释与实际使用的字段保持一致（使用 end_date 而非 event_date）
  getEventStatus(event: Event): string {
    const now = new Date();
    const eventEndDate = new Date(event.end_date); // Use end_date from Event model

    if (now < eventEndDate) return 'Upcoming'; // Event not ended yet
    if (now > eventEndDate) return 'Past';     // Event has ended
    return 'Active';                          // Event is ongoing (same day)
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Upcoming': return 'status-upcoming';
      case 'Past': return 'status-past';
      default: return 'status-unknown';
    }
  }
}