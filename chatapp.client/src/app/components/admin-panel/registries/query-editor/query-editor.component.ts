import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../../services/admin.service';
import { Router } from '@angular/router';
import { SqlResultModel } from '../../../../models/sql-result-model';

@Component({
  selector: 'app-query-editor',
  templateUrl: './query-editor.component.html',
  styleUrl: './query-editor.component.css'
})
export class QueryEditorComponent {
  query = '';
  result: SqlResultModel | null = null;

  constructor(
    private toastr: ToastrService,
    private adminService: AdminService,
    private router: Router
  ) { }

  runQuery() {
    this.adminService.executeSql(this.query).subscribe({
      next: (res: SqlResultModel) => {
        this.result = res
      },
      error: (err) => {
        this.result = {
          message: err.error?.message || 'Error',
          columns: [],
          rows: [],
          success: false
        }
      }
    });
  }
}
