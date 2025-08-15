import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="cards">
      <mat-card class="card success">
        <mat-card-title>128</mat-card-title>
        <mat-card-subtitle>本日新註冊</mat-card-subtitle>
      </mat-card>
      <mat-card class="card success">
        <mat-card-title>56</mat-card-title>
        <mat-card-subtitle>活躍行銷活動</mat-card-subtitle>
      </mat-card>
      <mat-card class="card success">
        <mat-card-title>$84,120</mat-card-title>
        <mat-card-subtitle>本月營收</mat-card-subtitle>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .cards { margin-top: 32px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
      .card { padding: 8px; background: var(--mat-sys-surface-container); }
      .card.success { border-left: 4px solid var(--mat-sys-primary); }
      .card.info { border-left: 4px solid var(--mat-sys-secondary); }
      .card.revenue { border-left: 4px solid var(--mat-sys-tertiary); }
    `,
  ],
})
export class DashboardComponent {}


