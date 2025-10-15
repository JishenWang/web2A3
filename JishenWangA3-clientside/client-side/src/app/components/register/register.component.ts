import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, Registration } from '../../models/event.model';
import { Formatters } from '../../utils/formatters';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  event: Event | null = null;
  loading = true;
  error: string | null = null;
  submitting = false;
  
  registration: Registration = {
    event_id: 0,
    user_name: '',
    user_email: '',
    phone: '',
    ticket_quantity: 1,
    registration_date: new Date().toISOString().split('T')[0]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.registration.event_id = parseInt(eventId);
      this.loadEventDetails(parseInt(eventId));
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
    }
  }

  loadEventDetails(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.event = response.data;
        } else {
          this.error = response.error || 'Failed to load event details';
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error loading event details: ' + (error.error?.error || error.message);
        this.loading = false;
      }
    });
  }

  submitRegistration(): void {
    if (!this.registration.user_name || !this.registration.user_email || !this.registration.phone) {
      alert('Please fill in all required fields (Name, Email, and Phone)');
      return;
    }

    this.submitting = true;

    this.eventService.registerForEvent(this.registration).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Registration successful! Thank you for registering.');
          this.router.navigate(['/event', this.registration.event_id]);
        } else {
          alert('Registration failed: ' + response.error);
          this.submitting = false;
        }
      },
      error: (error: any) => {
        alert('Registration failed: ' + (error.error?.error || error.message));
        this.submitting = false;
      }
    });
  }

  cancelRegistration(): void {
    this.router.navigate(['/event', this.registration.event_id]);
  }

  formatDate(dateString: string): string {
    return Formatters.formatDate(dateString);
  }

  formatPrice(price: number): string {
    return Formatters.formatPrice(price);
  }
}