import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-media-preview-dialog',
  templateUrl: './media-preview-dialog.component.html',
  styleUrl: './media-preview-dialog.component.css'
})
export class MediaPreviewDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { media: Media; sharedMedia: Media[] },
    private dialogRef: MatDialogRef<MediaPreviewDialogComponent>
  ) {}

  navigateMedia(direction: number) {
    const currentIndex = this.data.sharedMedia.findIndex(
      (m) => m.id === this.data.media.id
    );
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < this.data.sharedMedia.length) {
      this.data.media = this.data.sharedMedia[newIndex];
    }
  }

  hasOlderMedia(): boolean {
    const currentIndex = this.data.sharedMedia.findIndex(
      (m) => m.id === this.data.media.id
    );
    return currentIndex > 0;
  }

  hasNewerMedia(): boolean {
    const currentIndex = this.data.sharedMedia.findIndex(
      (m) => m.id === this.data.media.id
    );
    return currentIndex < this.data.sharedMedia.length - 1;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

interface Media {
  id: number;
  url: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  modifiedAt: Date;
}