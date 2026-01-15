import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  template: `
    <section class="space-y-section">
      <ng-content></ng-content>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionComponent {}
