import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../../../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-save-message-modal',
  templateUrl: './save-message-modal.component.html',
  styleUrl: './save-message-modal.component.css'
})
export class SaveMessageModalComponent {
  message: any = {
    senderUsername: '',
    senderId: '',
    recipientUsername: '',
    recipientId: '',
    Content: '',
    hasMedia: '',
    media: null,
    isSeen: false,
    isDeleted: false,
    parentMessageId: null
  };
  loading = false;
  isEdit = false;

  constructor(
    public dialogRef: MatDialogRef<SaveMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { messageId?: number },
    private adminService: AdminService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.data && this.data.messageId) {
      this.isEdit = true;
      this.loading = true;
      this.adminService.getMessageById(this.data.messageId).subscribe({
        next: (res) => {
          const u = res.data;
          this.message = {
            id: u.id || 0,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            username: u.username || '',
            password: '',
            gender: u.gender || 0,
            confirmPassword: '',
            dateOfBirth: u.dateOfBirth || '',
            phone: u.phone || ''
          };
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Failed to load message details');
          this.loading = false;
        }
      });
    }
    this.cdr.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.loading = true;
    this.adminService.saveOrUpdateMessage(this.message).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastr.success(this.isEdit ? 'Message updated successfully' : 'Message created successfully');
          this.dialogRef.close(true);
        } else {
          this.toastr.error(res.message || 'Failed to save message');
        }
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Failed to save message');
      }
    });
  }

  onMediaSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.message.media = {
        id: 0,
        messageId: this.message.id || 0,
        url: e.target.result,
        fileType: file.type,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString()
      };
      this.message.hasMedia = true;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }
  
  removeMedia(): void {
    this.message.media = null;
    this.message.hasMedia = false;
  }
  
}
