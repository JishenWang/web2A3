import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './admin/event-list/event-list.component';
import { EventFormComponent } from './admin/event-form/event-form.component';

export const routes: Routes = [
  { path: 'admin/events', component: EventListComponent },
  { path: 'admin/events/new', component: EventFormComponent },
  { path: 'admin/events/edit/:id', component: EventFormComponent },
  { path: '', redirectTo: '/admin/events', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // 传统路由配置方式
  exports: [RouterModule]
})
export class AppRoutingModule { }