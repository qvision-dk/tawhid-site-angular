import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminTypesService } from './admin-types.service';
import { ActivityIconsRepository } from '../../../core/data/activity-icons.repository';
import { ActivityIcon } from '../../activities/models/activity-icon.model';

@Component({
  selector: 'app-admin-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-types.page.html'
})
export class AdminTypesPage implements OnInit {
  readonly service = inject(AdminTypesService);
  private readonly fb = inject(FormBuilder);
  private readonly iconsRepository = inject(ActivityIconsRepository);

  readonly showCreateForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly typeForm: FormGroup;
  readonly activityIcons = signal<ActivityIcon[]>([]);
  readonly showDeleteConfirm = signal<boolean>(false);
  readonly deleting = signal<boolean>(false);
  readonly typeToDelete = signal<{ id: string; label: string } | null>(null);

  constructor() {
    this.typeForm = this.fb.group({
      iconSlug: ['', Validators.required],
      label: ['', Validators.required],
      sortOrder: [null]
    });
  }

  ngOnInit(): void {
    this.service.loadAll();
    this.loadActivityIcons();
  }

  private async loadActivityIcons(): Promise<void> {
    try {
      const icons = await this.iconsRepository.getAll();
      this.activityIcons.set(icons);
    } catch (error) {
      console.error('Error loading activity icons:', error);
    }
  }

  startEdit(type: { id: string; slug: string; label: string; sortOrder?: number }): void {
    this.editingId.set(type.id);
    this.showCreateForm.set(false);
    this.typeForm.patchValue({
      iconSlug: type.slug,
      label: type.label,
      sortOrder: type.sortOrder || null
    });
  }

  cancelEdit(): void {
    this.showCreateForm.set(false);
    this.editingId.set(null);
    this.typeForm.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }

    const { iconSlug, label, sortOrder } = this.typeForm.value;

    try {
      if (this.editingId()) {
        await this.service.update(this.editingId()!, iconSlug, label, sortOrder || undefined);
      } else {
        await this.service.create(iconSlug, label, sortOrder || undefined);
      }
      this.cancelEdit();
    } catch (error) {
      // Error is handled by service
    }
  }

  openDeleteConfirm(id: string, label: string): void {
    this.typeToDelete.set({ id, label });
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.typeToDelete.set(null);
  }

  async confirmDelete(): Promise<void> {
    const type = this.typeToDelete();
    if (!type) return;

    this.deleting.set(true);
    try {
      await this.service.delete(type.id);
      this.closeDeleteConfirm();
    } catch (error) {
      // Error is handled by service
      console.error('Error deleting activity type:', error);
    } finally {
      this.deleting.set(false);
    }
  }
}
