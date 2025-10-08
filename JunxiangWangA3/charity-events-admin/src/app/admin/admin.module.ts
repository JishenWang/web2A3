import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { EventListComponent } from './event-list/event-list.component';    // 注意：字母l
import { EventFormComponent } from './event-form/event-form.component';    // 注意：字母l

@NgModule({
  declarations: [
    EventListComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }