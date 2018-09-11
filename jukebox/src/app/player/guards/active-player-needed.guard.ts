import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PlayerService} from '../player.service';

@Injectable()
export class ActivePlayerNeededGuard implements CanActivate {
  private _playerService: PlayerService;
  private _router: Router;

  constructor(playerService: PlayerService, router: Router)
  {
    this._playerService = playerService;
    this._router = router;

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this._playerService.activePlayer == null)
    {
      this._router.navigateByUrl('player/select');
      return false;
    }

    return true;
  }
}
