import {Component, OnInit} from '@angular/core';
import {BlogPostService} from './blog-post.service';
import {UserService} from './user.service';
import {throwError} from 'rxjs';  // Angular 6/RxJS 6
import { error } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  /**
   * An object representing the user for the login form
   */
  public user: any;

  /**
   * An array of all the BlogPost objects from the API
   */
  public posts;

  /**
   * An object representing the data in the "add" form
   */
  public new_post: any;

  register;

  constructor(private _blogPostService: BlogPostService, public _userService: UserService) { }

  ngOnInit() {
    this._userService.rememberMe()
    this.getPosts();
    this.new_post = {};
    this.user = {
      email: '',
      password: ''
    };
    this.register = {
      name: '',
      email: '',
      password: ''
    }
  }

  registerUser() {
    this._userService.registerUser(this.register);
  }

  login() {
    this._userService.login({'email': this.user.email, 'password': this.user.password});
    console.log("LoggedIn:", this._userService.isLoggedIn());
    console.log("LoggedOut:", this._userService.isLoggedOut());
  }

  refreshToken() {
    this._userService.refreshToken();
    console.log("LoggedIn:", this._userService.isLoggedIn());
    console.log("LoggedOut:", this._userService.isLoggedOut());
  }

  logout() {
    this._userService.logout();
    console.log("LoggedIn:", this._userService.isLoggedIn());
    console.log("LoggedOut:", this._userService.isLoggedOut());
  }

  getPosts() {
    this._blogPostService.list().subscribe(
      // the first argument is a function which runs on success
      data => {
        this.posts = data;
        // convert the dates to a nice format
        for (let post of this.posts) {
          post.date = new Date(post.date);
        }
      },
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading posts')
    );
  }

  createPost() {
    this._blogPostService.create(this.new_post, this.user.access).subscribe(
       data => {
         // refresh the list
         this.getPosts();
         return true;
       },
       error => {
         console.error('Error saving!');
         return throwError(error);
       }
    );
  }

}
