import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-vision-mission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-vision-mission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutVisionMissionComponent {}
