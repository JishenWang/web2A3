import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true, // 必须包含这一行，标记为独立组件
  imports: [CommonModule] // 若有依赖的其他独立组件/指令，需在此导入
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
          this.loadEvents();
          // Clear message after 3 seconds
          setTimeout(() => this.deleteMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          if (error.error?.error?.includes('existing registrations')) {
            this.error = 'Cannot delete event with existing registrations.';
          } else {
            this.error = 'Failed to delete event. Please try again.';
          }
          // Clear error after 5 seconds
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  getEventStatus(event: Event): string {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) return 'Upcoming';
    if (now > endDate) return 'Past';
    return 'Active';
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