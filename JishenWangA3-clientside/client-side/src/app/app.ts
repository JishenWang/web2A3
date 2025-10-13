import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; // 添加 RouterModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // 添加 RouterModule 到这里
  template: `
    <nav>
      <div class="nav-container">
        <ul class="nav-menu">
          <li><a routerLink="/" routerLinkActive="active">Home</a></li>
          <li><a routerLink="/search" routerLinkActive="active">Search Events</a></li>
        </ul>
      </div>
    </nav>

    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.css']
})
export class App {
  title = 'Charity Events';
}