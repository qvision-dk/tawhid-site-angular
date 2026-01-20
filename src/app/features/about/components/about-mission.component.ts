import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-mission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-mission.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutMissionComponent {}
