import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { User } from '../../model/User';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { SearchbarComponent } from '../../searchbar/searchbar.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DeleteItemDialogComponent } from '../component/delete-item-dialog/delete-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { CreateUserDialogComponent } from '../component/create-user-dialog/create-user-dialog.component';
import { EditUserDialogComponent } from '../component/edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-manage-users',
  imports: [CommonModule,MatSnackBarModule,MatPaginatorModule,MatTableModule,MatIconModule,SearchbarComponent,MatSortModule,MatToolbarModule],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent implements OnInit {
users:MatTableDataSource<User> = new MatTableDataSource<User>([]);
displayedColumns:string[]=[
  'userId',
  'username',
  'email',
  'role',
  'actions'
]
searchKey:string = '';
@ViewChild(MatPaginator) paginator!:MatPaginator;
@ViewChild(MatSort) sort!:MatSort;
constructor(private userService:UserService,private snackbar:MatSnackBar,private dialog:MatDialog,private router: Router){}
ngOnInit(): void {
  this.getUsers();
  this.users.filterPredicate = (data: User, filter: string) => {
        const f = JSON.parse(filter);
  
        const matchesSearch =
          !f.search || data.username.toLowerCase().includes(f.search);
        return matchesSearch ;
      };
}
ngAfterViewInit():void{
  this.users.sort = this.sort;
  this.users.paginator = this.paginator;
}
getUsers():void
{
  this.userService.getUsers().subscribe({
    next:(data)=>{
      this.users.data = data;
    },
    error: (err)=>{
      console.error(err);
    }
  })
}

openDeleteDialog(item: any): void {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent, {
      width: '500px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePost(item.userId);
        this.getUsers();
      }
    });
  }

   deletePost(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this.getUsers();
        console.log('User deleted successfully:', response);
      },
      error: (error) => {
        console.error('errror while delete user', error);
      },
    });
  }
onFiltersChanged(filters: {
    search?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const filterStr = JSON.stringify({
      search: filters.search?.toLowerCase() ?? '',
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    this.users.filter = filterStr;

    if (this.users.paginator) {
      this.users.paginator.firstPage();
    }
  }

  openCreateUserDialog():void{
    const dialogRef = this.dialog.open(CreateUserDialogComponent,{width:'600px'});
    dialogRef.afterClosed().subscribe((result) => {
      if(result)
      {
        this.getUsers();
      }
    })
  }

  openEditDialog(user: any): void {
      const dialogRef = this.dialog.open(EditUserDialogComponent, {width:'600px', data: user });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getUsers();
        }
      });
    }
}
