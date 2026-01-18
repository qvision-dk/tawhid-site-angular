import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersHeroComponent } from './components/members-hero.component';
import { MembersPlansComponent } from './components/members-plans.component';
import { MembersBenefitsComponent } from './components/members-benefits.component';
import { PrayerTimesComponent } from '../../shared/widgets/prayer-times.component';
import { UpcomingWidgetComponent } from '../../shared/widgets/upcoming-widget.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, MembersHeroComponent, MembersPlansComponent, MembersBenefitsComponent, PrayerTimesComponent, UpcomingWidgetComponent],
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent {}