import { Component } from '@angular/core';

// 关键：添加 @Component 装饰器，声明为 Angular 组件
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html', // 修正模板文件后缀（.component.html）
  styleUrls: ['./event-list.component.css']   // 修正样式文件后缀（.component.css）
})
export class EventListComponent {
}