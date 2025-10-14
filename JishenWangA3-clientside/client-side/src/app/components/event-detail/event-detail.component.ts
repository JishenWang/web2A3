import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { WeatherService } from '../../services/weather.service';
import { Event, Registration } from '../../models/event.model';
import { Formatters } from '../../utils/formatters';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  progressPercent = 0;
  weather: any = null;
  registrations: Registration[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (!eventId) {
      this.error = 'No event ID found. Please select an event from Home or Search page.';
      this.loading = false;
      return;
    }

    this.loadEventDetails(parseInt(eventId));
  }

  loadEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.event = response.data;
          this.calculateProgress();
          this.loadRegistrations(eventId);
          
          if (this.event.latitude && this.event.longitude) {
            this.loadWeather(this.event.latitude, this.event.longitude);
          }
        } else {
          this.error = response.error || 'Failed to load event details';
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error: ' + (error.error?.error || error.message);
        this.loading = false;
      }
    });
  }

  loadRegistrations(eventId: number): void {
    this.eventService.getEventRegistrations(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.registrations = response.data;
        }
      },
      error: (error: any) => {
        console.error('Error loading registrations:', error);
      }
    });
  }

  loadWeather(latitude: number, longitude: number): void {
    this.weatherService.getWeatherForecast(latitude, longitude).subscribe({
      next: (weather: any) => {
        this.weather = weather;
      },
      error: (error: any) => {
        console.error('Error loading weather:', error);
      }
    });
  }

  calculateProgress(): void {
    if (!this.event) return;
    const currentAmount = this.event.current_amount || 0;
    const goalAmount = this.event.goal_amount || 0;
    this.progressPercent = Formatters.calculateProgress(currentAmount, goalAmount);
  }

  formatDate(dateString: string): string {
    return Formatters.formatDate(dateString);
  }

  formatPrice(price: number): string {
    return Formatters.formatPrice(price);
  }

  getWeatherDescription(weatherCode: number): string {
    return this.weatherService.getWeatherDescription(weatherCode);
  }

  goToRegister(): void {
    if (this.event) {
      this.router.navigate(['/register', this.event.id]);
    }
  }
}