import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';
import { RequestViewModel } from '../../../../../models/request-view-model';

@Component({
  selector: 'app-update-request-modal',
  templateUrl: './update-request-modal.component.html',
  styleUrls: ['./update-request-modal.component.css']
})
export class UpdateRequestModalComponent implements OnInit {
  model: any = {};
  loading = false;

  requestStatuses = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Canceled' },
    { value: 3, label: 'Accepted' },
    { value: 4, label: 'Rejected' }
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateRequestModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { request: RequestViewModel },
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.model = { id: this.data.request.id, requestStatus: this.data.request.requestStatus };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.adminService.updateRequest(this.model).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success('Request updated successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to update request');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to update request');
      }
    });
  }
}
