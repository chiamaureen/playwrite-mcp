import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Campaign, CampaignApprovalStatus, CampaignService } from './campaign.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'app-campaign-approvals',
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="head">
      <h2>活動審批</h2>
    </div>

    <table mat-table [dataSource]="pending" class="mat-elevation-z1 full">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> 名稱 </th>
        <td mat-cell *matCellDef="let c"> {{ c.name }} </td>
      </ng-container>

      <ng-container matColumnDef="budget">
        <th mat-header-cell *matHeaderCellDef> 預算 </th>
        <td mat-cell *matCellDef="let c"> $ {{ c.budget | number }} </td>
      </ng-container>

      <ng-container matColumnDef="period">
        <th mat-header-cell *matHeaderCellDef> 期間 </th>
        <td mat-cell *matCellDef="let c"> {{ c.startDate }} ~ {{ c.endDate }} </td>
      </ng-container>

      <ng-container matColumnDef="approval">
        <th mat-header-cell *matHeaderCellDef> 狀態 </th>
        <td mat-cell *matCellDef="let c">
          <mat-chip-set>
            <mat-chip [ngClass]="'chip--' + (c.approval || 'pending')">{{ c.approval || 'pending' }}</mat-chip>
          </mat-chip-set>
          <div class="history" *ngIf="(c.approvalHistory?.length || 0) > 0">
            <div class="history-item" *ngFor="let h of c.approvalHistory">
              <span class="date">{{ h.at | date:'yyyy-MM-dd HH:mm' }}</span>
              <span class="status">{{ h.status }}</span>
              <span class="by" *ngIf="h.by">by {{ h.by }}</span>
              <span class="reason" *ngIf="h.reason">- {{ h.reason }}</span>
            </div>
          </div>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef> 審批 </th>
        <td mat-cell *matCellDef="let c">
          <button mat-raised-button color="primary" (click)="openDetail(c.id)">審批</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .head { display:flex; align-items:center; justify-content:space-between; margin-bottom: 12px; }
    .full { width: 100%; }
    .chip--pending { background:#ef6c00; color:#fff; }
    .chip--approved { background:#2e7d32; color:#fff; }
    .chip--rejected { background:#b71c1c; color:#fff; }
    .reason { width: 320px; margin-right: 8px; }
    .history { margin-top: 6px; font-size: 12px; color: #555; }
    .history-item { display: flex; gap: 6px; align-items: center; }
    .history-item .date { color: #777; }
  `],
})
export class CampaignApprovalsComponent {
  pending: Campaign[] = [];
  displayedColumns = ['name', 'budget', 'period', 'approval', 'actions'];

  constructor(private readonly campaigns: CampaignService) {
    this.refresh();
  }

  openDetail(id: string) {
    // Navigating without RouterLink since this is a table action
    window.location.href = `/admin/campaigns/${id}/detail`;
  }

  private refresh() {
    this.pending = this.campaigns.list().filter(c => (c.approval || 'pending') === 'pending');
  }
}


