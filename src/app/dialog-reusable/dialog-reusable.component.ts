import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-reusable',
  templateUrl: './dialog-reusable.component.html',
  styleUrls: ['./dialog-reusable.component.scss']
})
export class DialogReusableComponent implements OnInit {
  contentType: 'alert' | 'addFunds';

  constructor(
    public dialogRef: MatDialogRef<DialogReusableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: 'alert' | 'addFunds'; title?: string; message?: string; funds?: number }
  ) {
    this.contentType = data.type;
  }

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  onAddFunds(): void {
    if (this.data.funds) {
      this.dialogRef.close(this.data.funds);
    }
  }
}
