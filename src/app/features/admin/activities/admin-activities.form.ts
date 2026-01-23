import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivityAdmin } from '../../activities/models/activity.model';
import { ActivityType } from '../../activities/models/activity-type.model';
import { RepeatBadge } from '../../activities/models/activity.model';

@Component({
  selector: 'app-admin-activities-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-activities.form.html'
})
export class AdminActivitiesFormComponent implements OnInit {
  @Input() activity: ActivityAdmin | null = null;
  @Input() activityTypes: ActivityType[] = [];
  @Output() submit = new EventEmitter<{
    id?: string;
    title: string;
    description?: string | null;
    activity_type_id: string;
    date?: string | null;
    weekday?: number | null;
    start_time?: string | null;
    end_time?: string | null;
    location?: string | null;
    repeat_badge?: RepeatBadge | null;
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
      activityTypeId: ['', Validators.required],
      date: [''],
      weekday: [null],
      startTime: [''],
      endTime: [''],
      location: [''],
      repeatBadge: [''],
      isActive: [false]
    });
  }

  ngOnInit(): void {
    if (this.activity) {
      this.form.patchValue({
        title: this.activity.title,
        description: this.activity.description || '',
        activityTypeId: this.activity.activity_type_id,
        date: this.activity.date || '',
        weekday: this.activity.weekday ?? null,
        startTime: this.activity.start_time ? this.activity.start_time.substring(0, 5) : '',
        endTime: this.activity.end_time ? this.activity.end_time.substring(0, 5) : '',
        location: this.activity.location || '',
        repeatBadge: this.activity.repeat_badge || '',
        isActive: this.activity.is_active ?? false
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
      title: (value.title && typeof value.title === 'string') ? value.title.trim() : '',
      description: (value.description && typeof value.description === 'string' && value.description.trim()) ? value.description.trim() : null,
      activity_type_id: value.activityTypeId,
      date: value.date || null,
      weekday: value.weekday !== null && value.weekday !== '' ? Number(value.weekday) : null,
      start_time: value.startTime || null,
      end_time: value.endTime || null,
      location: (value.location && typeof value.location === 'string' && value.location.trim()) ? value.location.trim() : null,
      repeat_badge: value.repeatBadge && value.repeatBadge.trim() ? value.repeatBadge : null,
      is_active: value.isActive ?? false
    };

    this.submit.emit(payload);
    this.isSubmitting.set(false);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
