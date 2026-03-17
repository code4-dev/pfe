import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/navbar/navbar/navbar';
import { Sidebar } from './shared/sidebar/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private router: Router) {}

  hideShell(): boolean {
    return this.router.url.startsWith('/login') || this.router.url.startsWith('/register');
  }
}
