import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../../core/models/auth.models';
import { UserService } from '../../../../../core/services/user.service';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    userForm: FormGroup;
    isEdit = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        public dialogRef: MatDialogRef<UserFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: User | null
    ) {
        this.isEdit = !!data;
        this.userForm = this.fb.group({
            fullName: [data?.fullName || '', Validators.required],
            email: [data?.email || '', [Validators.required, Validators.email]],
            password: ['', this.isEdit ? [] : [Validators.required, Validators.minLength(6)]],
            role: [data?.role || 'User', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.userForm.valid) {
            const userData = this.userForm.value;
            if (this.isEdit && this.data) {
                this.userService.update(this.data.id, userData).subscribe(() => {
                    this.dialogRef.close(true);
                });
            } else {
                this.userService.create(userData).subscribe(() => {
                    this.dialogRef.close(true);
                });
            }
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
