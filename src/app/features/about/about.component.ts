import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutHeroComponent } from './components/about-hero.component';
import { AboutMissionComponent } from './components/about-mission.component';
import { AboutVisionMissionComponent } from './components/about-vision-mission.component';
import { AboutValuesComponent } from './components/about-values.component';
import { AboutJourneyComponent } from './components/about-journey.component';
import { AboutSidebarComponent } from './components/about-sidebar.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, AboutHeroComponent, AboutMissionComponent, AboutVisionMissionComponent, AboutValuesComponent, AboutJourneyComponent, AboutSidebarComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {}