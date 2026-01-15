import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="badgeClasses">
      <ng-content></ng-content>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() variant: 'default' | 'primary' = 'default';

  get badgeClasses(): string {
    const base = 'inline-flex items-center rounded-badge px-4 py-1.5 text-caption font-emphasis uppercase tracking-wider';
    return this.variant === 'primary' 
      ? `${base} bg-brand text-text-inverse`
      : `${base} bg-surface-muted text-text-secondary`;
  }
}
