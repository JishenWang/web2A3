import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // 若需HTTP请求
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule // 按需保留
  ],
  providers: [], // 全局服务提供者（如无则留空）
  // 移除 bootstrap 和 declarations（独立组件无需模块引导）
})
export class AppModule { }