import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminTypesService } from './admin-types.service';

@Component({
  selector: 'app-admin-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-display font-bold text-secondary dark:text-white mb-2">Aktivitetstyper</h2>
          <p class="text-slate-600 dark:text-slate-400">Administrer aktivitetstyper</p>
        </div>
        <button
          (click)="showCreateForm.set(true)"
          class="bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
        >
          <span class="material-icons-round text-sm">add</span>
          Ny type
        </button>
      </div>

      <!-- Error Message -->
      @if(service.error()) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p class="text-red-600 dark:text-red-400 text-sm font-medium">{{service.error()}}</p>
        </div>
      }

      <!-- Create/Edit Form -->
      @if(showCreateForm() || editingSlug()) {
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-display font-bold text-secondary dark:text-white">
              {{editingSlug() ? 'Rediger type' : 'Ny type'}}
            </h3>
            <button
              (click)="cancelEdit()"
              class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <span class="material-icons-round">close</span>
            </button>
          </div>

          <form [formGroup]="typeForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Slug *</label>
                <input
                  formControlName="slug"
                  [readonly]="!!editingSlug()"
                  [class]="'w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-3 px-4 text-secondary dark:text-white transition-all' + (editingSlug() ? ' opacity-60 cursor-not-allowed' : '')"
                  placeholder="prayer"
                  type="text"
                />
                @if(typeForm.get('slug')?.invalid && typeForm.get('slug')?.touched) {
                  <p class="text-red-500 text-xs">Slug er påkrævet</p>
                }
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Label *</label>
                <input
                  formControlName="label"
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-3 px-4 text-secondary dark:text-white transition-all"
                  placeholder="Bøn"
                  type="text"
                />
                @if(typeForm.get('label')?.invalid && typeForm.get('label')?.touched) {
                  <p class="text-red-500 text-xs">Label er påkrævet</p>
                }
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Sorteringsrækkefølge</label>
                <input
                  formControlName="sortOrder"
                  class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-3 px-4 text-secondary dark:text-white transition-all"
                  placeholder="1"
                  type="number"
                />
              </div>
            </div>

            <div class="flex gap-4">
              <button
                type="submit"
                [disabled]="typeForm.invalid || service.loading()"
                class="bg-primary hover:bg-amber-600 disabled:bg-slate-400 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors"
              >
                {{editingSlug() ? 'Opdater' : 'Opret'}}
              </button>
              <button
                type="button"
                (click)="cancelEdit()"
                class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-full text-sm font-bold transition-colors"
              >
                Annuller
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Loading State -->
      @if(service.loading()) {
        <div class="text-center py-12">
          <p class="text-slate-600 dark:text-slate-400">Indlæser...</p>
        </div>
      }

      <!-- Types List -->
      @if(!service.loading() && service.types().length > 0) {
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
          <div class="space-y-4">
            @for(type of service.types(); track type.slug) {
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <div class="flex-1">
                  <div class="flex items-center gap-4">
                    <span class="font-mono text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg">
                      {{type.slug}}
                    </span>
                    <span class="text-lg font-bold text-secondary dark:text-white">{{type.label}}</span>
                    @if(type.sortOrder !== undefined) {
                      <span class="text-sm text-slate-500 dark:text-slate-400">Sort: {{type.sortOrder}}</span>
                    }
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                    (click)="startEdit(type)"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Rediger
                  </button>
                  <button
                    (click)="confirmDelete(type.slug)"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Slet
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Empty State -->
      @if(!service.loading() && service.types().length === 0) {
        <div class="bg-white dark:bg-slate-900 rounded-[2rem] p-12 border border-slate-100 dark:border-slate-800 text-center">
          <p class="text-slate-600 dark:text-slate-400">Ingen aktivitetstyper endnu</p>
        </div>
      }
    </div>
  `
})
export class AdminTypesPage implements OnInit {
  readonly service = inject(AdminTypesService);
  private readonly fb = inject(FormBuilder);

  readonly showCreateForm = signal(false);
  readonly editingSlug = signal<string | null>(null);
  readonly typeForm: FormGroup;

  constructor() {
    this.typeForm = this.fb.group({
      slug: ['', Validators.required],
      label: ['', Validators.required],
      sortOrder: [null]
    });
  }

  ngOnInit(): void {
    this.service.loadAll();
  }

  startEdit(type: { slug: string; label: string; sortOrder?: number }): void {
    this.editingSlug.set(type.slug);
    this.showCreateForm.set(false);
    this.typeForm.patchValue({
      slug: type.slug,
      label: type.label,
      sortOrder: type.sortOrder || null
    });
  }

  cancelEdit(): void {
    this.showCreateForm.set(false);
    this.editingSlug.set(null);
    this.typeForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }

    const { slug, label, sortOrder } = this.typeForm.value;

    try {
      if (this.editingSlug()) {
        await this.service.update(slug, label, sortOrder || undefined);
      } else {
        await this.service.create(slug, label, sortOrder || undefined);
      }
      this.cancelEdit();
    } catch (error) {
      // Error is handled by service
    }
  }

  async confirmDelete(slug: string): Promise<void> {
    if (confirm(`Er du sikker på, at du vil slette aktivitetstypen "${slug}"?`)) {
      try {
        await this.service.delete(slug);
      } catch (error) {
        // Error is handled by service
      }
    }
  }
}
