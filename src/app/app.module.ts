import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BlogPostService } from './blog-post.service';
import { UserService } from './user.service';

import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";

export function tokenGetter() {
  return localStorage.getItem("access");
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["127.0.0.1", "127.0.0.1:8000", "localhost:8000"],
        blacklistedRoutes: ["example.com/examplebadroute/"],
      }
    })
  ],
  providers: [
    BlogPostService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
