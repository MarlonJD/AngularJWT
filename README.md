# AngularJWT

This project made for Django JWT Auth. 'Remember me' with session. Register and login on home page. You can add your blog post with this user. User model is custom in Django.
Angular 8.1.1 build result will be in ../static/frontend/. You can change that in angular.json. You can access on Django server.

## Getting Started
1) Install the angular/cli if doesn't exist on your system
```
npm install -g @angular/cli
```
2) Install the packages that need
```
npm install
```
3) Option 1: Bui d the angular project.
```
ng build
```
4) Option 2: serve on other port (4200)
```
ng serve -o
```
## Build

Run `ng build` to build the project. The build artifacts will be stored in the `../static/frontend/` directory. Use the `--prod` flag for a production build. But you should set static files for Django. (You should use nginx or something else for static file serving)



