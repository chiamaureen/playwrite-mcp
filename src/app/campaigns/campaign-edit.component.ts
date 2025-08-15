import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CampaignFormComponent } from './campaign-form.component';

@Component({
  standalone: true,
  selector: 'app-campaign-edit',
  imports: [CommonModule, CampaignFormComponent],
  template: `
    <h2>編輯活動</h2>
    <app-campaign-form mode="edit" [campaignId]="id" />
  `,
})
export class CampaignEditComponent {
  id: string | null = null;

  constructor(private readonly route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}


