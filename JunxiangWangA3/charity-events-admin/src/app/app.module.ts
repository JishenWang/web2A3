// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module'; // 导入独立路由模块
import { AppComponent } from './app.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule // 导入后，<router-outlet>即可被识别
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }