import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
  // 移除 standalone: true
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = false;
  error = '';

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
        this.error = '加载事件列表失败，请稍后重试。';
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
    if (confirm('确定要删除这个事件吗？此操作不可撤销。')) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          if (error.error?.error?.includes('existing registrations')) {
            alert('无法删除已有报名者的事件。');
          } else {
            alert('删除事件失败，请稍后重试。');
          }
        }
      });
    }
  }
}