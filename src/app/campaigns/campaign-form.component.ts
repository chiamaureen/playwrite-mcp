import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CampaignService, Campaign, CampaignStatus } from './campaign.service';

@Component({
  standalone: true,
  selector: 'app-campaign-form',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <form (ngSubmit)="submit()" class="form">
      <mat-form-field>
        <mat-label>名稱</mat-label>
        <input matInput [(ngModel)]="model.name" name="name" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>狀態</mat-label>
        <mat-select [(ngModel)]="model.status" name="status">
          <mat-option value="draft">draft</mat-option>
          <mat-option value="active">active</mat-option>
          <mat-option value="paused">paused</mat-option>
          <mat-option value="ended">ended</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>預算 (NT$)</mat-label>
        <input matInput type="number" [(ngModel)]="model.budget" name="budget" min="0" />
      </mat-form-field>

      <div class="grid">
        <mat-form-field>
          <mat-label>開始日期</mat-label>
          <input matInput type="date" [(ngModel)]="model.startDate" name="startDate" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>結束日期</mat-label>
          <input matInput type="date" [(ngModel)]="model.endDate" name="endDate" />
        </mat-form-field>
      </div>

      <mat-form-field>
        <mat-label>投放渠道 (以逗號分隔)</mat-label>
        <input matInput [(ngModel)]="channelsText" name="channels" placeholder="facebook, google" />
      </mat-form-field>

      <div class="actions">
        <button mat-raised-button color="primary" type="submit">儲存</button>
        <button mat-button type="button" (click)="cancel()">取消</button>
      </div>
    </form>
  `,
  styles: [
    `
      .form { max-width: 640px; display:flex; flex-direction:column; gap:12px; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      .actions { display:flex; gap:8px; margin-top: 8px; }
    `,
  ],
})
export class CampaignFormComponent {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() campaignId: string | null = null;

  model: Campaign = {
    id: '',
    name: '',
    status: 'draft',
    budget: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    channels: [],
  };

  channelsText = '';

  constructor(private readonly campaigns: CampaignService, private readonly router: Router) {}

  ngOnInit() {
    if (this.mode === 'edit' && this.campaignId) {
      const existing = this.campaigns.getById(this.campaignId);
      if (existing) {
        this.model = { ...existing };
        this.channelsText = existing.channels.join(', ');
      }
    }
  }

  submit() {
    const channels = this.channelsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (this.mode === 'create') {
      this.campaigns.create({ ...this.model, channels });
    } else if (this.mode === 'edit' && this.campaignId) {
      this.campaigns.update(this.campaignId, { ...this.model, channels });
    }
    this.router.navigateByUrl('/admin/campaigns');
  }

  cancel() {
    this.router.navigateByUrl('/admin/campaigns');
  }
}


