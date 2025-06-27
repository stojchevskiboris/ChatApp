import { Component } from '@angular/core';
import { UserViewModel } from '../../models/user-view-model';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.service';
import { UserRoleViewModel } from '../../models/user-role-view-model';
import { RoleEnum } from '../../models/enums/role-enum';
import { Router } from '@angular/router';
import { SectionEnum } from '../../models/enums/section-enum';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  loading: boolean = true;
  currentUserRoleModel: UserRoleViewModel;
  isUserInAdminRole: boolean;
  rolesEnum: any = RoleEnum;
  sectionEnum = SectionEnum;
  selectedSection: SectionEnum = SectionEnum.Users;
  
  constructor(
    private toastr: ToastrService,
    private adminService: AdminService,
    private router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.adminService.getCurrentUserRole()
    .subscribe(
      (response: UserRoleViewModel) => {
        if (response) {
          this.currentUserRoleModel = response;
          this.isUserInAdminRole = this.currentUserRoleModel.role == this.rolesEnum.Admin
          if (!this.isUserInAdminRole) {
            this.toastr.error('You do not have permission to access this page');
            this.router.navigate(['/home']);
            return;
          }
        }
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.toastr.warning('You do not have permission to access this page');
        // this.router.navigate(['/home']);
        return;
      },
      () => {
        this.loading = false;
      }
    );
  }

}
