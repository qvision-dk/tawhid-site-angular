import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../activities/models/activity.model';
import { ActivityType } from '../../activities/models/activity-type.model';
import { RepeatBadge } from '../../activities/models/activity.model';

@Component({
  selector: 'app-admin-activities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100 dark:border-slate-800">
      <div class="space-y-6">
        <div class="space-y-4">
          <div class="w-16 h-1 bg-primary rounded-full"></div>
          <h3 class="text-3xl font-display font-bold text-secondary dark:text-white">
            {{activity ? 'Rediger aktivitet' : 'Ny aktivitet'}}
          </h3>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Titel *</label>
              <input
                formControlName="title"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                placeholder="Aftenbøn i dag"
                type="text"
              />
              @if(form.get('title')?.invalid && form.get('title')?.touched) {
                <p class="text-red-500 text-xs">Titel er påkrævet</p>
              }
            </div>

            <!-- Description -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Beskrivelse</label>
              <textarea
                formControlName="description"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                placeholder="Beskrivelse af aktiviteten"
                rows="4"
              ></textarea>
            </div>

            <!-- Activity Type -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Aktivitetstype *</label>
              <select
                formControlName="typeSlug"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
              >
                <option value="">Vælg type</option>
                @for(type of activityTypes; track type.slug) {
                  <option [value]="type.slug">{{type.label}}</option>
                }
              </select>
              @if(form.get('typeSlug')?.invalid && form.get('typeSlug')?.touched) {
                <p class="text-red-500 text-xs">Aktivitetstype er påkrævet</p>
              }
            </div>

            <!-- Repeat Badge -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Gentagelse</label>
              <select
                formControlName="repeatBadge"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
              >
                <option value="">Ingen</option>
                <option value="weekly">Ugentlig</option>
                <option value="monthly">Månedlig</option>
                <option value="yearly">Årlig</option>
              </select>
            </div>

            <!-- Date -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Dato</label>
              <input
                formControlName="date"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                type="date"
              />
            </div>

            <!-- Weekday -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Ugedag (0=Søndag, 6=Lørdag)</label>
              <input
                formControlName="weekday"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                type="number"
                min="0"
                max="6"
              />
            </div>

            <!-- Start Time -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Starttid</label>
              <input
                formControlName="startTime"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                type="time"
              />
            </div>

            <!-- End Time -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Sluttid</label>
              <input
                formControlName="endTime"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                type="time"
              />
            </div>

            <!-- Location -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 dark:text-slate-300">Lokation</label>
              <input
                formControlName="location"
                class="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-primary rounded-xl py-4 px-6 text-secondary dark:text-white transition-all"
                placeholder="Moskéen"
                type="text"
              />
            </div>

            <!-- Is Active -->
            <div class="md:col-span-2 flex items-center gap-3">
              <input
                formControlName="isActive"
                type="checkbox"
                id="isActive"
                class="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label for="isActive" class="text-sm font-bold text-slate-700 dark:text-slate-300">
                Aktiv (synlig for brugere)
              </label>
            </div>
          </div>

          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting()"
              class="bg-primary hover:bg-amber-600 disabled:bg-slate-400 text-white px-8 py-4 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
            >
              {{activity ? 'Opdater' : 'Opret'}}
            </button>
            <button
              type="button"
              (click)="cancel.emit()"
              class="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-full text-sm font-bold transition-colors"
            >
              Annuller
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class AdminActivitiesFormComponent implements OnInit {
  @Input() activity: Activity | null = null;
  @Input() activityTypes: ActivityType[] = [];
  @Output() submit = new EventEmitter<{
    id?: string;
    title: string;
    description?: string;
    type_slug: string;
    date?: string;
    weekday?: number;
    start_time?: string;
    end_time?: string;
    location?: string;
    repeat_badge?: RepeatBadge;
    is_active?: boolean;
  }>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  readonly isSubmitting = signal(false);

  readonly form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      typeSlug: ['', Validators.required],
      date: [''],
      weekday: [null],
      startTime: [''],
      endTime: [''],
      location: [''],
      repeatBadge: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    if (this.activity) {
      this.form.patchValue({
        title: this.activity.title,
        description: this.activity.description || '',
        typeSlug: this.activity.typeSlug,
        date: this.activity.date || '',
        weekday: this.activity.weekday ?? null,
        startTime: this.activity.startTime ? this.activity.startTime.substring(0, 5) : '',
        endTime: this.activity.endTime ? this.activity.endTime.substring(0, 5) : '',
        location: this.activity.location || '',
        repeatBadge: this.activity.repeatBadge || '',
        isActive: this.activity.isActive ?? true
      });
    }
  }


  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    this.isSubmitting.set(true);

    const payload = {
      ...(this.activity?.id && { id: this.activity.id }),
      title: value.title,
      description: value.description || undefined,
      type_slug: value.typeSlug,
      date: value.date || undefined,
      weekday: value.weekday !== null && value.weekday !== '' ? Number(value.weekday) : undefined,
      start_time: value.startTime || undefined,
      end_time: value.endTime || undefined,
      location: value.location || undefined,
      repeat_badge: value.repeatBadge || undefined,
      is_active: value.isActive ?? true
    };

    this.submit.emit(payload);
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
