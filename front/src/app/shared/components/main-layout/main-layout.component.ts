import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  showSidebar = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkSidebar(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkSidebar(event.url);
    });
  }

  private checkSidebar(url: string): void {
    this.showSidebar = url.includes('/admin') ||
      url.includes('/analytics') ||
      url === '/categories' ||
      url === '/subcategories';
  }
}
