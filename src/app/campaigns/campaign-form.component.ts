import { Component, computed, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CampaignService, Campaign, CampaignStatus } from './campaign.service';
import { HalfwidthValidatorDirective } from './halfwidth.directive';

export class YyyyMmDdDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: any): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  override parse(value: any): Date | null {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return super.parse(value);
  }
}

export const YYYY_MM_DD_FORMATS = {
  parse: { dateInput: 'yyyy-MM-dd' },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'yyyy MMM',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'yyyy MMM',
  },
};

@Component({
  standalone: true,
  selector: 'app-campaign-form',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, HalfwidthValidatorDirective],
  providers: [
    { provide: DateAdapter, useClass: YyyyMmDdDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: YYYY_MM_DD_FORMATS },
  ],
  template: `
    <form #f="ngForm" (ngSubmit)="submit(f)" class="form" novalidate>
      <mat-form-field>
        <mat-label>名稱</mat-label>
        <input matInput [(ngModel)]="model.name" name="name" required maxlength="15" appHalfwidth #nameModel="ngModel" />
        <mat-error *ngIf="nameModel.errors?.['fullwidth']">請使用半形字元</mat-error>
        <mat-hint align="end">{{ (model.name || '').length }}/15</mat-hint>
      </mat-form-field>

      <mat-form-field>
        <mat-label>狀態</mat-label>
        <mat-select [(ngModel)]="model.status" name="status" appHalfwidth>
          <mat-option value="draft">draft</mat-option>
          <mat-option value="active">active</mat-option>
          <mat-option value="approving">approving</mat-option>
          <mat-option value="ended">ended</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field>
        <mat-label>預算 (NT$)</mat-label>
        <input matInput type="text" inputmode="numeric" [(ngModel)]="budgetText" name="budget" pattern="^[1-9]\\d*$" required appHalfwidth #budgetModel="ngModel" />
        <mat-error *ngIf="budgetModel.errors?.['required']">此欄位為必填</mat-error>
        <mat-error *ngIf="budgetModel.errors?.['pattern']">請輸入不以 0 開頭的正整數</mat-error>
        <mat-error *ngIf="budgetModel.errors?.['fullwidth']">請使用半形數字</mat-error>
      </mat-form-field>

      <div class="grid">
        <mat-form-field>
          <mat-label>開始日期</mat-label>
          <input matInput [matDatepicker]="startPicker" [(ngModel)]="startDateObj" name="startDate" [max]="endDateObj || undefined" #startDateModel="ngModel" />
          <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
          <mat-datepicker #startPicker></mat-datepicker>
          <mat-error *ngIf="startDateModel.invalid && (startDateModel.touched || startDateModel.dirty)">
            開始日期不可晚於結束日期
          </mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>結束日期</mat-label>
          <input matInput [matDatepicker]="endPicker" [(ngModel)]="endDateObj" name="endDate" [min]="startDateObj || undefined" #endDateModel="ngModel" />
          <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
          <mat-datepicker #endPicker></mat-datepicker>
          <mat-error *ngIf="endDateModel.invalid && (endDateModel.touched || endDateModel.dirty)">
            結束日期不可早於開始日期
          </mat-error>
        </mat-form-field>
      </div>

      <mat-form-field>
        <mat-label>投放渠道 (以逗號分隔)</mat-label>
        <input matInput [(ngModel)]="channelsText" name="channels" placeholder="facebook, google" appHalfwidth #channelsModel="ngModel" />
        <mat-error *ngIf="channelsModel.errors?.['fullwidth']">請使用半形字元</mat-error>
      </mat-form-field>

      <mat-form-field>
        <mat-label>活動網址</mat-label>
        <input matInput [(ngModel)]="model.url" name="url" pattern="https?://.+" placeholder="https://example.com" appHalfwidth #urlModel="ngModel" />
        <mat-error *ngIf="urlModel.errors?.['fullwidth']">請使用半形字元</mat-error>
        <mat-hint>需為有效網址，例如：https://example.com</mat-hint>
      </mat-form-field>

      <div class="actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="!f.form.valid">儲存</button>
        <button mat-button type="button" (click)="cancel()">取消</button>
      </div>
    </form>
  `,
  styles: [
    `
      .form { max-width: 640px; display:flex; flex-direction:column; gap:12px; }
      .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      .actions { display:flex; gap:8px; margin-top: 8px; }
      /* 將不符合格式的文字顯示為紅色（失焦或輸入中） */
      input.ng-invalid.ng-touched,
      input.ng-invalid.ng-dirty,
      .mat-mdc-form-field .mdc-text-field__input.ng-invalid.ng-touched,
      .mat-mdc-form-field .mdc-text-field__input.ng-invalid.ng-dirty {
        color: #d32f2f;
      }
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
    url: '',
  };

  channelsText = '';
  startDateObj: Date | null = new Date(this.model.startDate);
  endDateObj: Date | null = new Date(this.model.endDate);
  budgetText = '';
  
  constructor(private readonly campaigns: CampaignService, private readonly router: Router) {}

  ngOnInit() {
    if (this.mode === 'edit' && this.campaignId) {
      const existing = this.campaigns.getById(this.campaignId);
      if (existing) {
        this.model = { ...existing };
        this.channelsText = existing.channels.join(', ');
        this.startDateObj = existing.startDate ? new Date(existing.startDate) : null;
        this.endDateObj = existing.endDate ? new Date(existing.endDate) : null;
        this.budgetText = String(existing.budget || '');
      }
    }
  }

  submit(form: any) {
    if (!form?.form?.valid) return;
    const channels = this.channelsText
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    this.model.startDate = this.startDateObj ? new Date(this.startDateObj).toISOString().slice(0, 10) : '';
    this.model.endDate = this.endDateObj ? new Date(this.endDateObj).toISOString().slice(0, 10) : '';
    this.model.budget = this.budgetText ? Number(this.budgetText) : 0;

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


