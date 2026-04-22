import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RequestSearchModel } from '../../../../models/request-search-model';
import { RequestViewModel } from '../../../../models/request-view-model';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { AdminService } from '../../../../services/admin.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RemoveItemDialogComponent } from '../../../shared/remove-item-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UpdateRequestModalComponent } from './update-request-modal/update-request-modal.component';

@Component({
  selector: 'app-requests-registry',
  templateUrl: './requests-registry.component.html',
  styleUrl: './requests-registry.component.css'
})
export class RequestsRegistryComponent implements OnInit {
  searchModel: RequestSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<RequestViewModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  requestStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Canceled' },
    { value: 3, label: 'Accepted' },
    { value: 4, label: 'Rejected' }
  ];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;
    this.adminService.searchRequests(this.searchModel).subscribe({
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

  getStatusLabel(status: number): string {
    return this.requestStatuses.find(s => s.value === status)?.label || 'Unknown';
  }

  editRequest(request: RequestViewModel): void {
    const dialogRef = this.dialog.open(UpdateRequestModalComponent, { width: '400px', data: { request } });
    dialogRef.afterClosed().subscribe(result => { if (result) { this.search(); } });
  }

  deleteRequest(id: number): void {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, { width: '50%' });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.adminService.deleteRequest(id).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.info('Request deleted successfully');
            this.search();
          },
          error: () => {
            this.loading = false;
            this.toastr.error('Failed to delete request');
          }
        });
      }
    });
  }
}

