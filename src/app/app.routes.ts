import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./campaigns/campaign-list.component').then(m => m.CampaignListComponent)
      },
      {
        path: 'campaigns/approvals',
        loadComponent: () => import('./campaigns/campaign-approvals.component').then(m => m.CampaignApprovalsComponent)
      },
      {
        path: 'campaigns/new',
        loadComponent: () => import('./campaigns/campaign-new.component').then(m => m.CampaignNewComponent)
      },
      {
        path: 'campaigns/:id/edit',
        loadComponent: () => import('./campaigns/campaign-edit.component').then(m => m.CampaignEditComponent)
      }
      ,
      {
        path: 'campaigns/:id/detail',
        loadComponent: () => import('./campaigns/campaign-detail.component').then(m => m.CampaignDetailComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'admin' }
];
