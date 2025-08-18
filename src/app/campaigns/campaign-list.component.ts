import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CampaignService, Campaign } from './campaign.service';

@Component({
  standalone: true,
  selector: 'app-campaign-list',
  imports: [CommonModule, RouterLink, MatTableModule, MatButtonModule, MatChipsModule, MatIconModule],
  template: `
    <div class="head">
      <h2>行銷活動</h2>
      <a mat-raised-button color="primary" routerLink="/admin/campaigns/new">
        <mat-icon>add</mat-icon>
        建立活動
      </a>
    </div>

    <table mat-table [dataSource]="campaigns" class="mat-elevation-z1 full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> 名稱 </th>
        <td mat-cell *matCellDef="let c"> {{ c.name }} </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> 狀態 </th>
        <td mat-cell *matCellDef="let c">
          <mat-chip-set>
            <mat-chip appearance="outlined">{{ c.status }}</mat-chip>
          </mat-chip-set>
        </td>
      </ng-container>

      <ng-container matColumnDef="budget">
        <th mat-header-cell *matHeaderCellDef> 預算 </th>
        <td mat-cell *matCellDef="let c"> $ {{ c.budget | number }} </td>
      </ng-container>

      <ng-container matColumnDef="period">
        <th mat-header-cell *matHeaderCellDef> 期間 </th>
        <td mat-cell *matCellDef="let c"> {{ c.startDate }} ~ {{ c.endDate }} </td>
      </ng-container>

      <ng-container matColumnDef="channels">
        <th mat-header-cell *matHeaderCellDef> 渠道 </th>
        <td mat-cell *matCellDef="let c"> {{ c.channels.join(', ') }} </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> 動作 </th>
        <td mat-cell *matCellDef="let c">
          <button mat-button color="primary" [routerLink]="'/admin/campaigns/' + c.id + '/edit'" [disabled]="(c.approval || 'pending') === 'approved'">編輯</button>
          <button mat-button color="warn" (click)="remove(c.id)">刪除</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [
    `
      .head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
      .full { width: 100%; }
    `,
  ],
})
export class CampaignListComponent {
  campaigns: Campaign[] = [];
  displayedColumns = ['name', 'status', 'budget', 'period', 'channels', 'actions'];

  constructor(private readonly campaignsService: CampaignService) {
    this.campaigns = this.campaignsService.list();
  }

  remove(id: string) {
    this.campaignsService.delete(id);
    this.campaigns = this.campaignsService.list();
  }
}


