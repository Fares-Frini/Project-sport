import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../core/models/auth.models';

@Component({
    selector: 'app-user-detail',
    template: `
    <h2 mat-dialog-title class="brand-font">Détails de l'utilisateur</h2>
    <mat-dialog-content class="mat-typography">
      <div class="user-detail-container py-3">
        <div class="row mb-3">
          <div class="col-sm-4 text-muted">Nom complet</div>
          <div class="col-sm-8 fw-bold">{{ user.firstName }} {{ user.lastName }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-sm-4 text-muted">Email</div>
          <div class="col-sm-8">{{ user.email }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-sm-4 text-muted">Rôle</div>
          <div class="col-sm-8">
            <span class="badge" [ngClass]="user.role === 'Admin' ? 'bg-primary' : 'bg-secondary'">
              {{ user.role }}
            </span>
          </div>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Fermer</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .user-detail-container { min-width: 400px; }
    .badge { padding: 0.5em 1em; }
  `]
})
export class UserDetailComponent implements OnInit {
    user: User;

    constructor(
        public dialogRef: MatDialogRef<UserDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User }
    ) {
        this.user = data.user;
    }

    ngOnInit(): void { }

    onClose(): void {
        this.dialogRef.close();
    }
}
