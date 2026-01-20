import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-values',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-values.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutValuesComponent {}
