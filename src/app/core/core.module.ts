import {NgModule} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AngularFireAuthModule} from 'angularfire2/auth';
/* . . . */
@NgModule({
  /* . . . */
    imports: [
        AngularFireAuthModule,
    ],
  providers:    [AuthService]
})
export class CoreModule {
  /* . . . */
}
