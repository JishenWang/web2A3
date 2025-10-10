import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, Registration } from '../../models/event.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css'],
  standalone: true, // 必须包含这一行，标记为独立组件
  imports: [CommonModule,ReactiveFormsModule] // 若有依赖的其他独立组件/指令，需在此导入
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  registrations: Registration[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEventData(this.eventId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', [Validators.required, Validators.maxLength(200)]],
      category_id: ['', [Validators.required, Validators.min(1)]],
      max_tickets: ['', [Validators.required, Validators.min(1), Validators.max(10000)]]
    });
  }

  loadEventData(eventId: number): void {
    this.loading = true;
    this.eventService.getEventById(eventId).subscribe({
      next: (data) => {
        const event = data.event;
        this.registrations = data.registrations || [];
        
        this.eventForm.patchValue({
          title: event.title,
          description: event.description || '',
          start_date: this.formatDateForInput(event.start_date),
          end_date: this.formatDateForInput(event.end_date),
          location: event.location,
          category_id: event.category_id,
          max_tickets: event.max_tickets
        });
        
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load event data. Please try again.';
        this.loading = false;
        console.error('Error loading event:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      this.error = '';
      const formData = this.eventForm.value;

      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate <= startDate) {
        this.error = 'End date must be after start date.';
        this.loading = false;
        return;
      }

      if (this.isEditMode && this.eventId) {
        this.updateEvent(formData);
      } else {
        this.createEvent(formData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createEvent(formData: any): void {
    this.eventService.createEvent(formData).subscribe({
      next: (response) => {
        this.successMessage = 'Event created successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/events']);
        }, 1500);
      },
      error: (error) => {
        this.handleError(error, 'create');
      }
    });
  }

  private updateEvent(formData: any): void {
    this.eventService.updateEvent(this.eventId!, formData).subscribe({
      next: (response) => {
        this.successMessage = 'Event updated successfully!';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/admin/events']);
        }, 1500);
      },
      error: (error) => {
        this.handleError(error, 'update');
      }
    });
  }

  private handleError(error: any, action: string): void {
    this.error = `Failed to ${action} event. Please check your input and try again.`;
    this.loading = false;
    console.error(`Error ${action} event:`, error);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      control?.markAsTouched();
    });
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  goBack(): void {
    this.router.navigate(['/admin/events']);
  }

  getTotalTickets(): number {
    return this.registrations.reduce((total, reg) => total + reg.ticket_count, 0);
  }

  getRemainingTickets(): number {
    const maxTickets = this.eventForm.get('max_tickets')?.value || 0;
    return maxTickets - this.getTotalTickets();
  }
}