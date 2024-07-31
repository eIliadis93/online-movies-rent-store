import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowSizeService } from '../services/window-size.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  isAddMoviePanelOpen = false;
  isBubbleChartPanelOpen = false;
  isMobile: boolean = false;
  isRentalOpen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private windowSizeService: WindowSizeService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.windowSizeService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onAddMoviePanelOpen(): void {
    this.isAddMoviePanelOpen = true;
  }

  onBubbleChartPanelOpen(): void {
    this.isBubbleChartPanelOpen = true;
  }

  onRentalPanelOpen(): void {
    this.isRentalOpen = true;
  }
}
