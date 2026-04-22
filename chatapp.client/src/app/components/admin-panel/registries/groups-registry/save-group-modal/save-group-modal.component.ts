import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../../services/admin.service';

@Component({
  selector: 'app-save-group-modal',
  templateUrl: './save-group-modal.component.html',
  styleUrls: ['./save-group-modal.component.css']
})
export class SaveGroupModalComponent implements OnInit {
  group: any = { name: '' };
  loading = false;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<SaveGroupModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupId?: number },
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.groupId) {
      this.isEdit = true;
      this.loading = true;
      this.adminService.getGroupById(this.data.groupId).subscribe({
        next: (res) => {
          const g = res.data;
          this.group = { id: g.id, name: g.name };
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load group details');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.group.name?.trim()) {
      this.toastr.warning('Name is required');
      return;
    }
    this.loading = true;
    this.adminService.saveOrUpdateGroup(this.group).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success(this.isEdit ? 'Group updated successfully' : 'Group created successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to save group');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to save group');
      }
    });
  }
}
