import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event, EventDetailData, Registration, Category } from '../../models/event.model'; // 修正路径
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // 修正模块来源

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // 确保导入表单模块
})
export class EventFormComponent implements OnInit {
  eventId?: number;
  event: Event = {} as Event;
  registrations: Registration[] = [];
  eventForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  successMessage: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      category_id: [null, Validators.required],
      max_tickets: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.eventId;
    if (this.eventId) {
      this.loading = true;
      this.eventService.getEventDetail(this.eventId).subscribe({
        next: (data: EventDetailData) => {
          this.event = data.event;
          this.registrations = data.registrations || [];
          this.eventForm.patchValue(this.event);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load event details. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }
    this.loading = true;
    const eventData = this.eventForm.value;
    if (this.isEditMode) {
      this.eventService.updateEvent(this.eventId!, eventData).subscribe({
        next: () => {
          this.successMessage = 'Event updated successfully!';
          this.loading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (err) => {
          this.error = 'Failed to update event. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.successMessage = 'Event created successfully!';
          this.loading = false;
          setTimeout(() => this.successMessage = '', 3000);
          this.router.navigate(['/admin/events']);
        },
        error: (err) => {
          this.error = 'Failed to create event. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/events']);
  }

  getTotalTickets(): number {
    return this.registrations.reduce((total, reg) => total + reg.ticket_count, 0);
  }
}