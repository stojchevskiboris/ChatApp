import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RoleSearchModel } from '../../../../models/role-search-model';
import { UserAdminViewModel } from '../../../../models/user-admin-view-model';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { AdminService } from '../../../../services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UpdateRoleModalComponent } from './update-role-modal/update-role-modal.component';

@Component({
  selector: 'app-roles-registry',
  templateUrl: './roles-registry.component.html',
  styleUrl: './roles-registry.component.css'
})
export class RolesRegistryComponent implements OnInit {
  searchModel: RoleSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<UserAdminViewModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  roleLabels = ['User', 'Moderator', 'Admin'];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.adminService.searchRoles(this.searchModel).subscribe({
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

  getRoleLabel(role: number): string {
    return this.roleLabels[role] || 'Unknown';
  }

  editRole(user: UserAdminViewModel): void {
    const dialogRef = this.dialog.open(UpdateRoleModalComponent, { width: '400px', data: { user } });
    dialogRef.afterClosed().subscribe(result => { if (result) { this.search(); } });
  }
}

