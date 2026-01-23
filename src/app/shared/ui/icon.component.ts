import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if(slug) {
      <span class="material-symbols-rounded" [class]="classNames">
        {{ slug }}
      </span>
    }
  `
})
export class IconComponent {
  @Input({ required: true }) slug!: string;
  @Input() classNames: string = '';
}
