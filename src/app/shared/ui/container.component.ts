import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-container',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto px-page-x">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {}
