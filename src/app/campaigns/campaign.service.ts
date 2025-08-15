import { Injectable, Signal, computed, signal } from '@angular/core';

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'ended';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  channels: string[];
}

const STORAGE_KEY = 'marketing_campaigns';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly campaignsSignal = signal<Campaign[]>(this.hydrate());

  readonly campaigns: Signal<Campaign[]> = computed(() => this.campaignsSignal());

  list(): Campaign[] {
    return this.campaigns();
  }

  getById(id: string): Campaign | undefined {
    return this.campaigns().find((c) => c.id === id);
  }

  create(input: Omit<Campaign, 'id'>): Campaign {
    const newCampaign: Campaign = { ...input, id: crypto.randomUUID() };
    const next = [newCampaign, ...this.campaigns()];
    this.persist(next);
    return newCampaign;
  }

  update(id: string, patch: Partial<Omit<Campaign, 'id'>>): Campaign | undefined {
    const current = this.campaigns();
    const index = current.findIndex((c) => c.id === id);
    if (index < 0) return undefined;
    const updated: Campaign = { ...current[index], ...patch };
    const next = [...current];
    next[index] = updated;
    this.persist(next);
    return updated;
  }

  delete(id: string): void {
    const next = this.campaigns().filter((c) => c.id !== id);
    this.persist(next);
  }

  private persist(next: Campaign[]): void {
    this.campaignsSignal.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  private hydrate(): Campaign[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Campaign[];
    } catch {}
    // Seed fake data
    const seed: Campaign[] = [
      {
        id: crypto.randomUUID(),
        name: '雙11 全站 85 折',
        status: 'active',
        budget: 500000,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        channels: ['facebook', 'google', 'email'],
      },
      {
        id: crypto.randomUUID(),
        name: '黑色星期五 超殺優惠',
        status: 'draft',
        budget: 800000,
        startDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 20 * 86400000).toISOString().slice(0, 10),
        channels: ['instagram', 'line'],
      },
      {
        id: crypto.randomUUID(),
        name: '開學季 校園方案',
        status: 'paused',
        budget: 200000,
        startDate: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
        channels: ['google', 'youtube'],
      },
    ];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    } catch {}
    return seed;
  }
}


