import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { GroupSearchModel } from '../../../../models/group-search-model';
import { GroupViewModel } from '../../../../models/group-view-model';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { AdminService } from '../../../../services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RemoveItemDialogComponent } from '../../../shared/remove-item-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SaveGroupModalComponent } from './save-group-modal/save-group-modal.component';

@Component({
  selector: 'app-groups-registry',
  templateUrl: './groups-registry.component.html',
  styleUrl: './groups-registry.component.css'
})
export class GroupsRegistryComponent implements OnInit {
  searchModel: GroupSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<GroupViewModel>;
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
    this.adminService.searchGroups(this.searchModel).subscribe({
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

  addGroup(): void {
    const dialogRef = this.dialog.open(SaveGroupModalComponent, { width: '400px', data: {} });
    dialogRef.afterClosed().subscribe(result => { if (result) { this.search(); } });
  }

  editGroup(groupId: number): void {
    const dialogRef = this.dialog.open(SaveGroupModalComponent, { width: '400px', data: { groupId } });
    dialogRef.afterClosed().subscribe(result => { if (result) { this.search(); } });
  }

  deleteGroup(groupId: number): void {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.adminService.deleteGroup(groupId).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.info('Group removed successfully');
            this.search();
          },
          error: () => {
            this.loading = false;
            this.toastr.error('Failed to remove group');
          }
        });
      }
    });
  }
}

