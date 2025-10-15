import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event, Category } from '../../models/event.model';
import { Formatters } from '../../utils/formatters';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  categories: Category[] = [];
  searchParams: any = {};
  showResults = false;
  searchResults: Event[] = [];
  searching = false;
  searchError: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.eventService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data;
        }
      },
      error: (error: any) => {
        alert('Error loading categories: ' + (error.error?.error || error.message));
      }
    });
  }

  searchEvents(): void {
    if (this.searchParams.startDate && this.searchParams.endDate && 
        this.searchParams.startDate > this.searchParams.endDate) {
      alert('Start date cannot be later than end date');
      return;
    }

    this.searching = true;
    this.showResults = true;
    this.searchError = null;

    this.eventService.searchEvents(this.searchParams).subscribe({
      next: (response) => {
        if (response.success) {
          this.searchResults = response.data;
        } else {
          this.searchError = response.error || 'Search failed';
        }
        this.searching = false;
      },
      error: (error: any) => {
        this.searchError = 'Error: ' + (error.error?.error || error.message);
        this.searching = false;
      }
    });
  }

  resetForm(): void {
    this.searchParams = {};
    this.showResults = false;
    this.searchResults = [];
    this.searchError = null;
  }

  formatDate(dateString: string): string {
    return Formatters.formatDate(dateString);
  }

  formatPrice(price: number): string {
    return Formatters.formatPrice(price);
  }
}