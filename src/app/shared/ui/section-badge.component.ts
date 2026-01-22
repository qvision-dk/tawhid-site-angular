import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-section-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      @if(icon) {
        <span [class]="'material-icons-round text-sm ' + iconClasses" [class.animate-pulse]="animateIcon">{{icon}}</span>
      }
      <ng-content></ng-content>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiSectionBadgeComponent {
  @Input() icon?: string;
  @Input() variant: 'default' | 'hero' = 'default';
  @Input() animateIcon = false;

  get badgeClasses(): string {
    const base = 'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider';
    
    if (this.variant === 'hero') {
      return `${base} bg-slate-800 dark:bg-slate-900 border border-brand-gold text-brand-gold shadow-lg shadow-black/10`;
    }
    
    return `${base} bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400`;
  }

  get iconClasses(): string {
    if (this.variant === 'hero') {
      return 'text-brand-gold';
    }
    return '';
  }
}
