import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogReusableComponent } from '../dialog-reusable/dialog-reusable.component';


@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private dialog: MatDialog) {}

  openAlert(data: { type: 'alert' | 'addFunds'; title?: string; message?: string; funds?: number }): void {
    this.dialog.open(DialogReusableComponent, {
      width: '250px',
      data: data
    });
  }

  openAddFundsDialog(): Promise<number> {
    const dialogRef = this.dialog.open(DialogReusableComponent, {
      data: { type: 'addFunds', title: 'Add Funds' },
      width: '300px'
    });

    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          resolve(result);
        }
      });
    });
  }
}
