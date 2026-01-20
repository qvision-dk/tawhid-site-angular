import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-benefits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersBenefitsComponent {}
