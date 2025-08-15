import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule, MatListModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-sidenav-container class="layout">
      <mat-sidenav mode="side" opened class="sidenav">
        <mat-toolbar color="primary" class="brand-bar">行銷平台後台</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/admin/dashboard">
            <mat-icon aria-hidden="true" matListItemIcon>dashboard</mat-icon>
            <span>儀表板</span>
          </a>
          <a mat-list-item routerLink="/admin/campaigns">
            <mat-icon aria-hidden="true" matListItemIcon>campaign</mat-icon>
            <span>行銷活動</span>
          </a>
          <a mat-list-item routerLink="/admin/campaigns/approvals">
            <mat-icon aria-hidden="true" matListItemIcon>how_to_vote</mat-icon>
            <span>活動審批</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="topbar">
          <span class="brand">E‑Commerce Admin</span>
          <span class="spacer"></span>
          <!-- <mat-form-field appearance="outline" class="search">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="搜尋..." />
          </mat-form-field> -->
          <button mat-icon-button aria-label="notifications">
            <mat-icon style="color: #fff;">notifications</mat-icon>
          </button>
          <a mat-raised-button color="primary" routerLink="/admin/campaigns/new">
            <mat-icon>add</mat-icon>
            新增活動
          </a>
        </mat-toolbar>
        <main class="content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout { height: 100vh; }
      .sidenav { width: 260px; }
      .brand-bar { font-weight: 600; }
      .topbar { 
        background: linear-gradient(90deg, var(--mat-sys-primary) 0%, color-mix(in oklch, var(--mat-sys-primary) 70%, #ffffff) 100%);
      }
      .brand { font-weight: 600; }
      .spacer { flex: 1 1 auto; }
      .search { width: 320px; margin-right: 8px; }
      .content { padding: 16px; background: color-mix(in oklch, var(--mat-sys-surface) 85%, #ffffff); }
    `,
  ],
})
export class AdminLayoutComponent {
}


