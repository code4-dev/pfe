import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { catchError, interval, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  badgeCount = 0;
  private destroy$ = new Subject<void>();

  constructor(
    public auth: Auth,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    interval(300000)
      .pipe(
        startWith(0),
        switchMap(() => this.notificationService.getBadgeCount().pipe(
          catchError(() => of({ count: 0 }))
        )),
        takeUntil(this.destroy$)
      )
      .subscribe((badge) => {
        this.badgeCount = badge.count;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  canAccessNotifications(): boolean {
    return this.auth.hasRole('admin') || this.auth.hasRole('pilote');
  }
}
