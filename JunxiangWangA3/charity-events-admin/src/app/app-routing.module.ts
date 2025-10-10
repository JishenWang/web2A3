// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// 定义应用路由（示例，根据实际需求配置）
const routes: Routes = [
  // 示例路由：{ path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // 初始化根路由
  exports: [RouterModule] // 关键：导出RouterModule，使主模块能使用<router-outlet>
})
export class AppRoutingModule { }