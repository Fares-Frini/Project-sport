import { Component, OnInit } from '@angular/core';
import { User } from '../../../../../core/models/auth.models';
import { UserService } from '../../../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
    users: User[] = [];
    displayedColumns: string[] = ['fullName', 'email', 'role', 'actions'];

    constructor(
        private userService: UserService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getAll().subscribe(data => {
            this.users = data;
        });
    }

    openUserForm(user?: User): void {
        const dialogRef = this.dialog.open(UserFormComponent, {
            width: '500px',
            data: user || null
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadUsers();
            }
        });
    }

    deleteUser(id: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.userService.delete(id).subscribe(() => {
                this.loadUsers();
            });
        }
    }
}
