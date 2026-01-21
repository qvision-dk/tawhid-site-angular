/**
 * Admin Contact Messages List Page
 * 
 * Displays a list of contact messages sorted by status priority:
 * - 'new' messages first (highlighted)
 * - 'read' messages second
 * - 'replied' messages last (de-emphasized)
 * Within each group, newest first.
 */
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
        // Highlighted for visibility
        return 'bg-blue-500 dark:bg-blue-600 text-white font-bold';
      case 'read':
        // More visible in dark mode
        return 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white';
      case 'replied':
        // More visible in dark mode with higher opacity
        return 'bg-green-50 dark:bg-green-800/60 text-green-600 dark:text-green-200';
      default:
        return 'bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-white';
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
