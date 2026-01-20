import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminTypesService } from './admin-types.service';

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
