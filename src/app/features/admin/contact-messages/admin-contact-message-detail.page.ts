import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactMessagesAdminService } from './contact-messages-admin.service';
import { ContactMessage, ContactMessageStatus } from './models/contact-message.model';

@Component({
  selector: 'app-admin-contact-message-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-contact-message-detail.page.html'
})
export class AdminContactMessageDetailPage implements OnInit {
  readonly service = inject(ContactMessagesAdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly message = signal<ContactMessage | null>(null);
  readonly updating = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMessage(id);
    }
  }

  private async loadMessage(id: string): Promise<void> {
    const msg = await this.service.getById(id);
    if (msg) {
      this.message.set(msg);
      
      if (msg.status === 'new') {
        await this.updateStatus('read');
      }
    }
  }

  async updateStatus(status: ContactMessageStatus): Promise<void> {
    const msg = this.message();
    if (!msg) return;

    this.updating.set(true);
    try {
      await this.service.updateStatus(msg.id, status);
      const updated = await this.service.getById(msg.id);
      if (updated) {
        this.message.set(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      this.updating.set(false);
    }
  }

  getReplyMailtoLink(): string {
    const msg = this.message();
    if (!msg) return '';
    
    const subject = encodeURIComponent(`Re: ${msg.subject}`);
    const body = encodeURIComponent(`\n\n--- Original besked ---\nFra: ${msg.name} <${msg.email}>\nEmne: ${msg.subject}\n\n${msg.message}`);
    
    return `mailto:${msg.email}?subject=${subject}&body=${body}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'read':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'replied':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'archived':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'new':
        return 'Ny';
      case 'read':
        return 'Læst';
      case 'replied':
        return 'Besvaret';
      case 'archived':
        return 'Arkiveret';
      default:
        return status;
    }
  }
}
