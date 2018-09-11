import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {AuthenticationErrorResolver} from '../authentication-errorResolver';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  errorMessage = '';
  loading = false;
  private _authService: AuthenticationService;
  private _router: Router;

  constructor(authenticationService: AuthenticationService, router: Router) {
    this._authService = authenticationService;
    this._router = router;
  }

  ngOnInit() {
  }

  register() {
    this.loading = true;
    this._authService.register(this.email)
      .pipe(finalize(() => this.loading = false))
      .subscribe(() => {
        this._router.navigate(['/']);
      }, error => {
        this.errorMessage = AuthenticationErrorResolver.resolve(error);
      });
  }

}
