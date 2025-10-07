import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseFrontComponent } from './base-front/base-front.component';
import { LoginComponent } from './user/login/login.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ForgotpasswordComponent } from './user/forgotpassword/forgotpassword.component';
import { SettingeditprofileComponent } from './user/settingeditprofile/settingeditprofile.component';
import { NgOptimizedImage } from '@angular/common';
import { Navbar2Component } from './shared/navbar2/navbar2.component';
import { TermsconditionsComponent } from './user/termsconditions/termsconditions.component';
import { PrivacyPolicyComponent } from './user/privacy-policy/privacy-policy.component';
import { Error404Component } from './errors/error404/error404.component';
import { Error500Component } from './errors/error500/error500.component';
import { SigninComponent } from './user/signin/signin.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './backoffice/student/dashboard/dashboard.component';
import { Navbar3Component } from './shared/navbar3/navbar3.component';
import { Sidebar1Component } from './shared/sidebar1/sidebar1.component';
import { EditprofileComponent } from './backoffice/student/editprofile/editprofile.component';
import { DeleteprofileComponent } from './backoffice/student/deleteprofile/deleteprofile.component';
import { Sidebar2Component } from './shared/sidebar2/sidebar2.component';
import { DashboardAdminComponent } from './backoffice/admin/dashboard-admin/dashboard-admin.component';
import { UserlistComponent } from './backoffice/admin/userlist/userlist.component';
import { UsergridComponent } from './backoffice/admin/usergrid/usergrid.component';
import { SignupComponent } from './user/signup/signup.component';
import { ComingsoonComponent } from './errors/comingsoon/comingsoon.component';
import { AdmineditprofileComponent } from './backoffice/admin/admineditprofile/admineditprofile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VerifyotpComponent } from './user/verifyotp/verifyotp.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { UserSideBarComponent } from './shared/user-side-bar/user-side-bar.component';
import { SideBarArticleComponent } from './shared/side-bar-article/side-bar-article.component';
import {NgxQRCodeModule} from "ngx-qrcode2";

import { OffreComponent } from './offre/offre.component';
import { OffrepublicComponent } from './offrepublic/offrepublic.component';
import { LightboxModule } from 'ngx-lightbox';
import { SignupadminComponent } from './user/signupadmin/signupadmin.component';
import { LoginadminComponent } from './user/loginadmin/loginadmin.component';
import { StudenttbComponent } from './studenttb/studenttb.component';
import { StudentcandidatureComponent } from './studentcandidature/studentcandidature.component';
import { AdmincandidatureComponent } from './admincandidature/admincandidature.component';
import { StudentcandidaturestatComponent } from './studentcandidaturestat/studentcandidaturestat.component';
import { StudentHeaderComponent } from './shared/student-header/student-header.component';
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
import { StarRatingComponentComponent } from './star-rating-component/star-rating-component.component';
import { AdminfeedbackComponent } from './adminfeedback/adminfeedback.component';
import { StudentreclamComponent } from './studentreclam/studentreclam.component';
import { AdminreclamComponent } from './adminreclam/adminreclam.component';
import { AdmineqComponent } from './admineq/admineq.component';
import { StudenteqComponent } from './studenteq/studenteq.component';
import { StudenttransComponent } from './studenttrans/studenttrans.component';
import { StudentextComponent } from './studentext/studentext.component';
import { AdminextComponent } from './adminext/adminext.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    BaseFrontComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    ForgotpasswordComponent,
    SettingeditprofileComponent,
    Navbar2Component,
    TermsconditionsComponent,
    PrivacyPolicyComponent,
    Error404Component,
    Error500Component,
    SigninComponent,
    DashboardComponent,
    Navbar3Component,
    Sidebar1Component,
    EditprofileComponent,
    DeleteprofileComponent,
    Sidebar2Component,
    DashboardAdminComponent,
    UserlistComponent,
    UsergridComponent,
    SignupComponent,
    ComingsoonComponent,
    AdmineditprofileComponent,
    VerifyotpComponent,
    AdmineditprofileComponent,    
    ChangepasswordComponent,
    UserSideBarComponent,
    SideBarArticleComponent,
    OffreComponent,
    OffrepublicComponent,
    SignupadminComponent,
    LoginadminComponent,
    StudenttbComponent,
    StudentcandidatureComponent,
    AdmincandidatureComponent,
    StudentcandidaturestatComponent,
    StudentHeaderComponent,
    StudentconPartComponent,
    StudentreguladminComponent,
    StudentjustifaccComponent,
    AdminreguladminComponent,
    AdminjustifaccComponent,
    StudentmsgsComponent,
    StudentinfospratiqueComponent,
    AdminordremisComponent,
    StudentordremisComponent,
    StudentfeedbackComponent,
    StarRatingComponentComponent,
    AdminfeedbackComponent,
    StudentreclamComponent,
    AdminreclamComponent,
    AdmineqComponent,
    StudenteqComponent,
    StudenttransComponent,
    StudentextComponent,
    AdminextComponent,
    ChatbotComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOptimizedImage,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    LightboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
