import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';

@NgModule({
  declarations: [], // 移除独立组件的声明
  imports: [
    CommonModule,
    AdminRoutingModule,
    // 导入独立组件（替代声明）
    EventListComponent,
    EventFormComponent
  ]
})
export class AdminModule { }