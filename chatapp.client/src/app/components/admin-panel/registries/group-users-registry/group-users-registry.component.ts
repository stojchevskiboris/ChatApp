import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GroupUserSearchModel } from '../../../../models/group-user-search-model';
import { GroupUserViewModel } from '../../../../models/group-user-view-model';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { AdminService } from '../../../../services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RemoveItemDialogComponent } from '../../../shared/remove-item-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SaveGroupUserModalComponent } from './save-group-user-modal/save-group-user-modal.component';

@Component({
  selector: 'app-group-users-registry',
  templateUrl: './group-users-registry.component.html',
  styleUrl: './group-users-registry.component.css'
})
export class GroupUsersRegistryComponent implements OnInit {
  searchModel: GroupUserSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<GroupUserViewModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.adminService.searchGroupUsers(this.searchModel).subscribe({
      next: (result) => {
        this.loading = false;
        this.pagedResult = result.data;
      },
      error: () => {
        this.loading = false;
        this.toastr.warning('An unexpected error has occurred');
      }
    });
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
    this.isAsc = this.searchModel.sortDirection === 'ASC';
    this.searchModel.page = 0;
    this.paginator.firstPage();
    this.search();
  }

  resetFilters(): void {
    this.searchModel = { page: 0, size: 10, sortColumn: 'id', sortDirection: 'ASC' };
    this.isAsc = true;
    if (this.paginator) { this.paginator.firstPage(); }
    this.search();
  }

  addGroupUser(): void {
    const dialogRef = this.dialog.open(SaveGroupUserModalComponent, { width: '400px', data: {} });
    dialogRef.afterClosed().subscribe(result => { if (result) { this.search(); } });
  }

  deleteGroupUser(id: number): void {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.adminService.deleteGroupUser(id).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.info('Group user removed successfully');
            this.search();
          },
          error: () => {
            this.loading = false;
            this.toastr.error('Failed to remove group user');
          }
        });
      }
    });
  }
}

