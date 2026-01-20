import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private supabase: SupabaseClient;
  
  readonly isAuthenticated = signal<boolean>(false);
  readonly isAdmin = signal<boolean>(false);
  readonly user = signal<any>(null);
  readonly loading = signal<boolean>(false);

  constructor() {
    if (!environment.supabaseUrl || !environment.supabaseAnonKey) {
      throw new Error('Supabase environment variables are not configured.');
    }
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loading.set(true);
    try {
      const sessionResult = await (this.supabase.auth as any).getSession();
      const { data, error } = sessionResult;
      
      if (error) {
        console.error('Auth session error:', error);
        return;
      }

      if (data?.session?.user) {
        this.user.set(data.session.user);
        this.isAuthenticated.set(true);
        await this.checkAdminRole(data.session.user.id);
      }
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      this.loading.set(false);
    }

    // Listen for auth changes
    (this.supabase.auth as any).onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        this.user.set(session.user);
        this.isAuthenticated.set(true);
        await this.checkAdminRole(session.user.id);
      } else {
        this.user.set(null);
        this.isAuthenticated.set(false);
        this.isAdmin.set(false);
      }
    });
  }

  private async checkAdminRole(userId: string): Promise<void> {
    try {
      // Check if user has admin role in Supabase
      // This assumes you have a user_roles table or similar
      // Adjust query based on your actual schema
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin role:', error);
      }

      this.isAdmin.set(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
      this.isAdmin.set(false);
    }
  }

  async signIn(email: string, password: string): Promise<{ error: any | null }> {
    this.loading.set(true);
    try {
      const result = await (this.supabase.auth as any).signInWithPassword({
        email,
        password
      });

      const { data, error } = result;

      if (error) {
        return { error };
      }

      if (data?.user) {
        this.user.set(data.user);
        this.isAuthenticated.set(true);
        await this.checkAdminRole(data.user.id);
      }

      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      this.loading.set(false);
    }
  }

  async signOut(): Promise<void> {
    this.loading.set(true);
    try {
      await (this.supabase.auth as any).signOut();
      this.user.set(null);
      this.isAuthenticated.set(false);
      this.isAdmin.set(false);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
