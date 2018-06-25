import {BrowserModule} from '@angular/platform-browser';
[imports ...]

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
  providers: [ |\label{line:module_providers}|
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientErrorInterceptor,
      multi: true
    },
    [Interceptors ...]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], |\label{line:module_schemas}|
  bootstrap: [AppComponent] |\label{line:module_bootstrap}|
})
export class AppModule { }
