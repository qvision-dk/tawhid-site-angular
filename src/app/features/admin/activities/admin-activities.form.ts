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
  templateUrl: './admin-activities.form.html'
})
export class AdminActivitiesFormComponent implements OnInit {
  @Input() activity: Activity | null = null;
  @Input() activityTypes: ActivityType[] = [];
  @Output() submit = new EventEmitter<{
    id?: string;
    title: string;
    description?: string;
    activity_type_id: string;
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
      activityTypeId: ['', Validators.required],
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
      // Find matching activity type by slug to preselect correct option when editing
      const matchedType = this.activityTypes.find(t => t.slug === this.activity!.typeSlug);
      const activityTypeId = matchedType ? matchedType.id : '';

      this.form.patchValue({
        title: this.activity.title,
        description: this.activity.description || '',
        activityTypeId,
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
      title: (value.title && typeof value.title === 'string') ? value.title.trim() : '',
      description: (value.description && typeof value.description === 'string' && value.description.trim()) ? value.description.trim() : undefined,
      activity_type_id: value.activityTypeId,
      date: value.date || undefined,
      weekday: value.weekday !== null && value.weekday !== '' ? Number(value.weekday) : undefined,
      start_time: value.startTime || undefined,
      end_time: value.endTime || undefined,
      location: (value.location && typeof value.location === 'string' && value.location.trim()) ? value.location.trim() : undefined,
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
