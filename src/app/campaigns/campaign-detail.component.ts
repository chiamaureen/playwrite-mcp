import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Campaign, CampaignService } from './campaign.service';

@Component({
  standalone: true,
  selector: 'app-campaign-detail',
  imports: [CommonModule, RouterLink, FormsModule, MatCardModule, MatChipsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <a mat-button routerLink="/admin/campaigns/approvals">← 返回審批列表</a>
    <mat-card *ngIf="campaign" class="card">
      <mat-card-title>活動詳情</mat-card-title>
      <mat-card-content>
        <div class="row"><span class="label">名稱：</span><span>{{ campaign.name }}</span></div>
        <div class="row"><span class="label">狀態：</span>
          <mat-chip-set>
            <mat-chip appearance="outlined">{{ campaign.status }}</mat-chip>
          </mat-chip-set>
        </div>
        <div class="row"><span class="label">預算：</span><span>$ {{ campaign.budget | number }}</span></div>
        <div class="row"><span class="label">期間：</span><span>{{ campaign.startDate }} ~ {{ campaign.endDate }}</span></div>
        <div class="row"><span class="label">渠道：</span><span>{{ campaign.channels.join(', ') }}</span></div>
        <div class="row" *ngIf="campaign.url"><span class="label">網址：</span><a [href]="campaign.url" target="_blank">{{ campaign.url }}</a></div>
      </mat-card-content>
    </mat-card>

    <mat-card *ngIf="campaign" class="card">
      <mat-card-title>審批</mat-card-title>
      <mat-card-content>
        <mat-form-field appearance="outline" class="reason">
          <mat-label>審批原因（退回必填）</mat-label>
          <input matInput [(ngModel)]="reason" placeholder="請輸入原因" [disabled]="isApproved" />
        </mat-form-field>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="approve()" [disabled]="isApproved">通過</button>
          <button mat-button color="warn" (click)="reject()" [disabled]="isApproved">退回</button>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card *ngIf="campaign" class="card">
      <mat-card-title>審批歷程</mat-card-title>
      <mat-card-content>
        <div class="history" *ngIf="(campaign.approvalHistory?.length || 0) > 0; else noHistory">
          <div class="history-item" *ngFor="let h of campaign.approvalHistory">
            <span class="date">{{ h.at | date:'yyyy-MM-dd HH:mm' }}</span>
            <span class="status">{{ h.status }}</span>
            <span class="by" *ngIf="h.by">by {{ h.by }}</span>
            <span class="reason" *ngIf="h.reason">- {{ h.reason }}</span>
          </div>
        </div>
        <ng-template #noHistory>
          <div class="muted">尚無審批紀錄</div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .card { margin: 20px 0; padding: 12px 24px; background-color: #fff;
      .mat-mdc-card-title {
        margin: 0 0 12px 0;
      }
    }
    .row { display:flex; gap:8px; margin: 6px 0; align-items: center; }
    .label { width: 96px; color:#555; }
    .reason { width: 360px; max-width: 100%; }
    .actions { display:flex; gap:8px; margin-top: 8px; }
    .history { display:flex; flex-direction:column; gap:6px; }
    .history-item { display:flex; gap:6px; align-items:center; font-size: 13px; }
    .history-item .date { color:#777; }
    .muted { color:#777; }
  `]
})
export class CampaignDetailComponent {
  campaign: Campaign | undefined;
  id: string | null = null;
  reason = '';
  get isApproved() { return (this.campaign?.approval || 'pending') === 'approved'; }

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly campaigns: CampaignService) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.campaign = this.campaigns.getById(this.id);
  }

  approve() {
    if (!this.id) return;
    const current = this.campaigns.getById(this.id);
    const history = current?.approvalHistory ?? [];
    this.campaigns.update(this.id, { approval: 'approved', approvalHistory: [{ status: 'approved', at: new Date().toISOString(), reason: this.reason.trim(), by: 'admin' }, ...history] });
    this.reload();
  }

  reject() {
    if (!this.id) return;
    const reason = this.reason.trim();
    if (!reason) { alert('退回原因為必填'); return; }
    const current = this.campaigns.getById(this.id);
    const history = current?.approvalHistory ?? [];
    this.campaigns.update(this.id, { approval: 'rejected', approvalHistory: [{ status: 'rejected', at: new Date().toISOString(), reason, by: 'admin' }, ...history] });
    this.reload();
  }

  private reload() {
    if (this.id) this.campaign = this.campaigns.getById(this.id);
  }
}


