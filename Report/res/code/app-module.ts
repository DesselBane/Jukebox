import {BrowserModule} from '@angular/platform-browser';
[Imports...]

@NgModule({ |\label{line:module_decorator}|
  declarations: [ |\label{line:module_declarations}|
    AppComponent
  ],
  imports: [ |\label{line:module_imports}|
    BrowserModule,
    [...]
    //App Modules load here
    MenuModule,
    [...]
    //Has to be last !!!
    AppRoutingModule
  ],
  exports: [], |\label{line:module_exports}|
  providers: [ |\label{line:module_providers}|
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS, |\label{line:module_interceptor}|
      useClass: HttpClientErrorInterceptor,
      multi: true
    },
    [Interceptors...]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], |\label{line:module_schemas}|
  bootstrap: [AppComponent] |\label{line:module_bootstrap}|
})
export class AppModule { }
