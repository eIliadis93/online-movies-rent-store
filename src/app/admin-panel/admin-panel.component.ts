import { Component, OnDestroy } from '@angular/core';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnDestroy {
  isAddMoviePanelOpen = false;
  isBubbleChartPanelOpen = false;

  constructor(private movieService: MovieService) {}

  ngOnDestroy(): void {
    // Clean up any subscriptions or other resources if needed
  }

  onAddMoviePanelOpen(): void {
    this.isAddMoviePanelOpen = true;
    console.log('Add Movie Panel opened');
    // If you need to trigger some data fetch or reinitialization, you can do it here
  }

  onBubbleChartPanelOpen(): void {
    this.isBubbleChartPanelOpen = true;
    console.log('Bubble Chart Panel opened');
    // If you need to trigger some data fetch or reinitialization, you can do it here
  }
}
