import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignFormComponent } from './campaign-form.component';

@Component({
  standalone: true,
  selector: 'app-campaign-new',
  imports: [CommonModule, CampaignFormComponent],
  template: `
    <h2>建立活動</h2>
    <app-campaign-form mode="create" />
  `,
})
export class CampaignNewComponent {}


