import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactMessagesAdminService } from './contact-messages-admin.service';
import { ContactMessage } from './models/contact-message.model';

@Component({
  selector: 'app-admin-contact-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-contact-messages.page.html'
})
export class AdminContactMessagesPage implements OnInit {
  readonly service = inject(ContactMessagesAdminService);

  ngOnInit(): void {
    this.service.list();
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('da-DK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
