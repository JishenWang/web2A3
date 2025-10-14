import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { Formatters } from '../../utils/formatters';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadHomeEvents();
  }

  loadHomeEvents(): void {
    this.eventService.getHomeEvents().subscribe({
      next: (response) => {
        if (response.success) {
          this.events = response.data;
        } else {
          this.error = response.error || 'Failed to load events';
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error loading events: ' + (error.error?.error || error.message);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return Formatters.formatDate(dateString);
  }

  formatPrice(price: number): string {
    return Formatters.formatPrice(price);
  }
}