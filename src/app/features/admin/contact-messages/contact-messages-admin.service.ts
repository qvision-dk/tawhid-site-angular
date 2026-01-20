import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { ContactMessage, ContactMessageStatus } from './models/contact-message.model';

/**
 * Contact Messages Admin Service
 * 
 * Admin service for managing contact messages.
 * Delete functionality requires explicit user confirmation before execution.
 */
@Injectable({
  providedIn: 'root'
})
export class ContactMessagesAdminService {
  private readonly platformId = inject(PLATFORM_ID);
  private supabase: SupabaseClient;

  readonly messages = signal<ContactMessage[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured.');
    }

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
  }

  async list(): Promise<void> {
    if (!this.supabase) {
      this.error.set('Supabase client not initialized');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load messages: ${error.message}`);
      }

      const mappedMessages: ContactMessage[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        status: item.status || 'new',
        created_at: item.created_at,
        replied_at: item.replied_at
      }));

      // Sort by status priority: 'new' first, then 'read', then 'replied'
      // Within each group, newest first
      const statusPriority: Record<ContactMessageStatus, number> = {
        'new': 1,
        'read': 2,
        'replied': 3
      };

      const sortedMessages = mappedMessages.sort((a, b) => {
        const priorityA = statusPriority[a.status as ContactMessageStatus] || 99;
        const priorityB = statusPriority[b.status as ContactMessageStatus] || 99;
        
        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }
        
        // Same status, sort by date (newest first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      this.messages.set(sortedMessages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      this.error.set(message);
      console.error('Error loading messages:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async getById(id: string): Promise<ContactMessage | null> {
    if (!this.supabase) {
      this.error.set('Supabase client not initialized');
      return null;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const { data, error } = await this.supabase
        .from('contact_messages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(`Failed to load message: ${error.message}`);
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: data.status || 'new',
        created_at: data.created_at,
        replied_at: data.replied_at
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load message';
      this.error.set(message);
      console.error('Error loading message:', err);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async markAsRead(id: string): Promise<void> {
    if (!this.supabase) {
      this.error.set('Supabase client not initialized');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      // When marking as 'read', clear replied_at if it exists
      const { error } = await this.supabase
        .from('contact_messages')
        .update({ 
          status: 'read',
          replied_at: null
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to mark as read: ${error.message}`);
      }

      await this.list();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async markAsReplied(id: string): Promise<void> {
    if (!this.supabase) {
      this.error.set('Supabase client not initialized');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const { error } = await this.supabase
        .from('contact_messages')
        .update({ 
          status: 'replied',
          replied_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to mark as replied: ${error.message}`);
      }

      await this.list();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as replied';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<void> {
    if (!this.supabase) {
      this.error.set('Supabase client not initialized');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const { error } = await this.supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete message: ${error.message}`);
      }

      await this.list();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete message';
      this.error.set(message);
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
