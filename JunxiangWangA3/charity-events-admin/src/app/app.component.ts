import { Component } from '@angular/core';
// 1. 导入路由出口组件
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, // 独立组件标记（若有此配置，需走独立组件逻辑）
  imports: [RouterOutlet] // 2. 在 imports 中添加 RouterOutlet，使 <router-outlet> 可识别
})
export class AppComponent {
  title = 'charity-events-admin';
}