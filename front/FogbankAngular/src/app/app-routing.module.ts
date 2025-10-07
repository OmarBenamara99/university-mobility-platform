import { Injectable, NgModule } from '@angular/core';
import { CanActivate, Router, RouterModule, Routes } from '@angular/router';
import { BaseFrontComponent } from './base-front/base-front.component';
import { Error404Component } from './errors/error404/error404.component';
import { Error500Component } from './errors/error500/error500.component';
import { LoginComponent } from './user/login/login.component';
import { ForgotpasswordComponent } from './user/forgotpassword/forgotpassword.component';
import { SettingeditprofileComponent } from './user/settingeditprofile/settingeditprofile.component';
import { TermsconditionsComponent } from './user/termsconditions/termsconditions.component';
import { PrivacyPolicyComponent } from './user/privacy-policy/privacy-policy.component';
import { SigninComponent } from './user/signin/signin.component';
import { DashboardComponent } from './backoffice/student/dashboard/dashboard.component';
import { EditprofileComponent } from './backoffice/student/editprofile/editprofile.component';
import { DeleteprofileComponent } from './backoffice/student/deleteprofile/deleteprofile.component';
import { DashboardAdminComponent } from './backoffice/admin/dashboard-admin/dashboard-admin.component';
import { UserlistComponent } from './backoffice/admin/userlist/userlist.component';
import { UsergridComponent } from './backoffice/admin/usergrid/usergrid.component';
import { SignupComponent } from './user/signup/signup.component';
import { ComingsoonComponent } from './errors/comingsoon/comingsoon.component';
import { TokenStorageService } from './service/user/token-storage.service';
import { VerifyotpComponent } from './user/verifyotp/verifyotp.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { OffreComponent } from './offre/offre.component';
import { OffrepublicComponent } from './offrepublic/offrepublic.component';
import { SignupadminComponent } from './user/signupadmin/signupadmin.component';
import { LoginadminComponent } from './user/loginadmin/loginadmin.component';
import { StudenttbComponent } from './studenttb/studenttb.component';
import { StudentcandidatureComponent } from './studentcandidature/studentcandidature.component';
import { AdmincandidatureComponent } from './admincandidature/admincandidature.component';
import { StudentcandidaturestatComponent } from './studentcandidaturestat/studentcandidaturestat.component';
import { StudentconPartComponent } from './studentcon-part/studentcon-part.component';
import { StudentreguladminComponent } from './studentreguladmin/studentreguladmin.component';
import { StudentjustifaccComponent } from './studentjustifacc/studentjustifacc.component';
import { AdminreguladminComponent } from './adminreguladmin/adminreguladmin.component';
import { AdminjustifaccComponent } from './adminjustifacc/adminjustifacc.component';
import { StudentmsgsComponent } from './studentmsgs/studentmsgs.component';
import { StudentinfospratiqueComponent } from './studentinfospratique/studentinfospratique.component';
import { AdminordremisComponent } from './adminordremis/adminordremis.component';
import { StudentordremisComponent } from './studentordremis/studentordremis.component';
import { StudentfeedbackComponent } from './studentfeedback/studentfeedback.component';
import { AdminfeedbackComponent } from './adminfeedback/adminfeedback.component';
import { StudentreclamComponent } from './studentreclam/studentreclam.component';
import { AdminreclamComponent } from './adminreclam/adminreclam.component';
import { AdmineqComponent } from './admineq/admineq.component';
import { StudenteqComponent } from './studenteq/studenteq.component';
import { StudenttransComponent } from './studenttrans/studenttrans.component';
import { StudentextComponent } from './studentext/studentext.component';
import { AdminextComponent } from './adminext/adminext.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Injectable() // Ajoutez ce décorateur
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  canActivate(): boolean {
    if (this.tokenStorageService.getAccessToken()) {
      return true; // L'utilisateur est authentifié
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

const appRoutes: Routes = [
  
  
  { path: 'front', component: BaseFrontComponent },
  //PFE
  { path: 'home', component: BaseFrontComponent },
  { path: 'login', component: LoginComponent },
  { path: 'loginadmin', component: LoginadminComponent },
  { path: 'admin/users', component: UserlistComponent,canActivate: [AuthGuard], },
  { path: 'student/tb', component: StudenttbComponent,canActivate: [AuthGuard], },
  { path: 'student/candidature', component: StudentcandidatureComponent},
  { path: 'student/candidaturestat', component: StudentcandidaturestatComponent},
  { path: 'student/conpart', component: StudentconPartComponent},
  { path: 'student/reguladmin', component: StudentreguladminComponent},
  { path: 'student/justifacc', component: StudentjustifaccComponent},
  { path: 'student/msgs', component: StudentmsgsComponent},
  { path: 'student/infprat', component: StudentinfospratiqueComponent},
  { path: 'student/ordmis', component: StudentordremisComponent},
  { path: 'student/fb', component: StudentfeedbackComponent},
  { path: 'student/reclam', component: StudentreclamComponent},
  { path: 'student/eq', component: StudenteqComponent},
  { path: 'student/tr', component: StudenttransComponent},
  { path: 'student/ext', component: StudentextComponent},
  { path: 'student/chatbot', component: ChatbotComponent},
  { path: 'admin/offer',component:OffreComponent},
  { path: 'admin/candidature',component:AdmincandidatureComponent},
  { path: 'admin/offerpublic',component:OffrepublicComponent},
  { path: 'admin/reguladmin', component: AdminreguladminComponent},
  { path: 'admin/justifacc', component: AdminjustifaccComponent},
  { path: 'admin/ordmis', component: AdminordremisComponent},
  { path: 'admin/fb', component: AdminfeedbackComponent},
  { path: 'admin/reclam', component: AdminreclamComponent},
  { path: 'admin/eq', component: AdmineqComponent},
  { path: 'admin/ext', component: AdminextComponent},
  { path: 'register', component: SignupComponent },
  { path: 'registeradmin', component: SignupadminComponent },

  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'editprofile', component: SettingeditprofileComponent },
  
  { path: 'termsconditions', component: TermsconditionsComponent },
  { path: 'forgotpassword', component: ForgotpasswordComponent },
  { path: 'student/dahboard', component: DashboardComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: 'admin/dahboard', component: DashboardAdminComponent },
  
  { path: 'student/edit', component: EditprofileComponent },
  { path: 'admin/edit', component: EditprofileComponent },
  { path: 'student/delete', component: DeleteprofileComponent },
  { path: 'admin/usersgrid', component: UsergridComponent },
  { path: 'admin/edit', component: EditprofileComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'changepassword', component: ChangepasswordComponent },

  

  

  { path: 'otp', component: VerifyotpComponent }, // Assuming 'OtpComponent' is the component for the OTP page

  
  
  


  

  { path: 'error404', component: Error404Component },
  { path: 'error500', component: Error500Component },
  { path: 'comesoon', component: ComingsoonComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/comesoon', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
