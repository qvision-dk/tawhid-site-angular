import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-plans.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersPlansComponent {}
