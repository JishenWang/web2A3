import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, Registration } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
  // 移除 standalone: true
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  registrations: Registration[] = [];
  loading = false;
  error = '';

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
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      location: ['', Validators.required],
      category_id: ['', [Validators.required, Validators.min(1)]],
      max_tickets: ['', [Validators.required, Validators.min(1)]]
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
          description: event.description,
          start_date: this.formatDateForInput(event.start_date),
          end_date: this.formatDateForInput(event.end_date),
          location: event.location,
          category_id: event.category_id,
          max_tickets: event.max_tickets
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = '加载事件数据失败';
        this.loading = false;
        console.error('Error loading event:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      const formData = this.eventForm.value;

      if (this.isEditMode && this.eventId) {
        this.eventService.updateEvent(this.eventId, formData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/admin/events']);
          },
          error: (error) => {
            this.handleError(error, '更新');
          }
        });
      } else {
        this.eventService.createEvent(formData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/admin/events']);
          },
          error: (error) => {
            this.handleError(error, '创建');
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private handleError(error: any, action: string): void {
    this.error = `${action}事件失败，请检查表单数据或稍后重试。`;
    this.loading = false;
    console.error(`Error ${action.toLowerCase()} event:`, error);
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
}