import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-cta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-cta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeCtaComponent {}
