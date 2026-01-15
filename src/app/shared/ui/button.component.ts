import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [type]="type" [disabled]="disabled" [class]="buttonClasses">
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  get buttonClasses(): string {
    const base = 'rounded-button font-emphasis transition-all flex items-center gap-2';
    const sizeClasses = {
      sm: 'px-5 py-2 text-body-sm',
      md: 'px-8 py-4 text-body',
      lg: 'px-10 py-5 text-body'
    };
    const variantClasses = {
      primary: 'bg-brand hover:bg-brand-soft text-text-inverse shadow-card',
      secondary: 'bg-surface-muted hover:bg-surface text-text-primary',
      ghost: 'bg-transparent border border-border text-text-primary hover:bg-surface-muted'
    };
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
    return `${base} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${disabledClass}`;
  }
}
