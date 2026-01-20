/**
 * Admin Contact Message Detail Page
 * 
 * Displays full details of a contact message with actions for status updates and deletion.
 * Delete requires explicit user confirmation via modal dialog.
 */
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
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);

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
      
      // Automatically mark as 'read' when opening a 'new' message
      if (msg.status === 'new') {
        await this.markAsRead();
      }
    }
  }

  async markAsRead(): Promise<void> {
    const msg = this.message();
    if (!msg) return;

    this.updating.set(true);
    try {
      await this.service.markAsRead(msg.id);
      const updated = await this.service.getById(msg.id);
      if (updated) {
        this.message.set(updated);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    } finally {
      this.updating.set(false);
    }
  }

  async markAsReplied(): Promise<void> {
    const msg = this.message();
    if (!msg) return;

    this.updating.set(true);
    try {
      await this.service.markAsReplied(msg.id);
      const updated = await this.service.getById(msg.id);
      if (updated) {
        this.message.set(updated);
      }
    } catch (error) {
      console.error('Error marking as replied:', error);
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
        return 'bg-blue-500 dark:bg-blue-600 text-white font-bold';
      case 'read':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'replied':
        return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 opacity-75';
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
      default:
        return status;
    }
  }

  openDeleteConfirm(): void {
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
  }

  async confirmDelete(): Promise<void> {
    const msg = this.message();
    if (!msg) return;

    this.deleting.set(true);
    try {
      await this.service.delete(msg.id);
      // Navigate back to list after successful deletion
      this.router.navigate(['/admin/contact-messages']);
    } catch (error) {
      // Error is handled by service
      console.error('Error deleting message:', error);
    } finally {
      this.deleting.set(false);
      this.showDeleteConfirm.set(false);
    }
  }
}
