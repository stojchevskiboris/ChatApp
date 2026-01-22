import { Component, inject, ViewChild } from '@angular/core';
import { RemoveItemDialogComponent } from '../../../shared/remove-item-dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PagedResultModel } from '../../../../models/paged-result-model';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageSearchModel } from '../../../../models/message-search-model';
import { MessageAdminViewModel } from '../../../../models/message-admin-view-model';
import { SaveMessageModalComponent } from './save-message-modal/save-message-modal.component';

@Component({
    selector: 'app-messages-registry',
    templateUrl: './messages-registry.component.html',
    styleUrl: './messages-registry.component.css',
    standalone: false
})
export class MessagesRegistryComponent {
  searchModel: MessageSearchModel = {
    page: 0,
    size: 10,
    sortColumn: 'id',
    sortDirection: 'ASC'
  };

  loading: boolean = false;
  dialog = inject(MatDialog);
  isAsc: boolean = true;
  pagedResult: PagedResultModel<MessageAdminViewModel>;
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
    this.adminService.searchMessages(this.searchModel)
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

  addMessage(): void {
    const dialogRef = this.dialog.open(SaveMessageModalComponent, {
      width: '500px',
      height: '700px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  editMessage(messageId: number): void {
    const dialogRef = this.dialog.open(SaveMessageModalComponent, {
      width: '500px',
      data: { userId: messageId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  deleteMessage(messageId: number): void {
    const dialogRef = this.dialog.open(RemoveItemDialogComponent, {
      width: '50%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.loading = true;
        this.adminService.deleteMessage(messageId).subscribe({
          next: () => {
            this.loading = false;
            this.toastr.info('Message removed successfully');
            this.search();
          },
          error: (err) => {
            this.loading = false;
            this.toastr.error('Failed to remove message');
          },
          complete: () => {
            this.loading = false;
          },
        });
      }
    });
  }

  exportToCsv(): void {
    this.adminService.exportMessages(this.searchModel)
      .subscribe(result => {
        if (result && result.success && result.data) {

          // Decode base64 string to binary data
          const byteCharacters = atob(result.data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);

          // Create and download Blob
          const blob = new Blob([byteArray], { type: 'text/csv;charset=utf-8;' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'messages.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

        } else {
          this.toastr.error('Failed to export messages');
        }
      }, error => {
        this.toastr.error('Failed to export messages');
      });
  }
}
