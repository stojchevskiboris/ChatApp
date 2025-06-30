import { Component, inject, ViewChild } from '@angular/core';
import { UserSearchModel } from '../../../../models/user-search-model';
import { AdminService } from '../../../../services/admin.service';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { UserViewModel } from '../../../../models/user-view-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RemoveItemDialogComponent } from '../../../shared/remove-item-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SaveUserModalComponent } from './save-user-modal/save-user-modal.component';

@Component({
  selector: 'app-users-registry',
  templateUrl: './users-registry.component.html',
  styleUrl: './users-registry.component.css'
})
export class UsersRegistryComponent {
  searchModel: UserSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<UserViewModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.adminService.searchUsers(this.searchModel)
      .subscribe(result => {
        this.loading = false;
        this.pagedResult = result.data;
      }),
      (error) => {
        this.loading = false;
        this.toastr.warning('An unexpected error has occurred');
      },
      () => {
        this.loading = false;
      }
  }

  pageChanged(event: PageEvent): void {
    this.searchModel.page = event.pageIndex;
    this.searchModel.size = event.pageSize;
    this.search();
  }

  setSort(column: string): void {
    if (this.searchModel.sortColumn === column) {
      this.searchModel.sortDirection = this.searchModel.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.searchModel.sortColumn = column;
      this.searchModel.sortDirection = 'ASC';
    }
    this.isAsc = this.searchModel.sortDirection === 'ASC'
    this.searchModel.page = 0;
    this.paginator.firstPage();
    this.search();
  }

  resetFilters(): void {
    this.searchModel = {
      page: 0,
      size: 10,
      sortColumn: 'id',
      sortDirection: 'ASC'
    };
    this.isAsc = true;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.search();
  }

  addUser(): void {
    const dialogRef = this.dialog.open(SaveUserModalComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  editUser(userId: number): void {
    const dialogRef = this.dialog.open(SaveUserModalComponent, {
      width: '500px',
      data: { userId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.adminService.deleteUser(userId).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.info('User removed successfully');
            this.search();
          },
          error: (err) => {
            this.loading = false;
            this.toastr.error('Failed to remove user');
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }
}
