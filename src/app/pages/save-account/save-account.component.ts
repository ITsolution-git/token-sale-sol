import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MetaMaskService } from '../../shared/services/MetaMaskService/meta-mask.service';
import { UserService } from '../../shared/services/UserService/user.service';
import { Store } from '@ngrx/store';
import { ApplicationState } from '../../store/application-state';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../../store/store-data';
import { UPDATE_NICK_NAME } from '../../store/actions/user.actions';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-save-account',
  templateUrl: './save-account.component.html',
  styleUrls: ['./save-account.component.scss']
})
export class SaveAccountComponent implements OnInit {

  userState: Observable<UserState>;
  accountInfo: FormGroup;
  walletAddress: String = '';
  email: String = '';
  isEmailed: Boolean = true;
  isValidEmail: Boolean = true;
  // tslint:disable-next-line:max-line-length
  emailValidationExpression: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  nickName: String = '';
  isSaving = false;
  loaded = false;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private metaMaskService: MetaMaskService,
    private store: Store<ApplicationState>,
    private userService: UserService
  ) {
      this.userState = this.store.select('userState');
      this.createForm();
   }


  ngOnInit() {
    this.metaMaskService.getAccountInfo();

    this.userService.getUsers().subscribe((resp: User[]) => {
      this.users = resp;
      this.userState.subscribe(state => {
        if (state) {
          if (!state.unlocked) {
            this.navigateToMetaMask();
          }
          debugger;
          if (this.walletAddress !== state.walletAddress) {
            this.walletAddress = state.walletAddress;
            let registered = false,
                user_;
  
            for (const user of this.users)
              if (user.gzr.id == state.walletAddress) {
                registered = true;
                user_ = user;
                break;
              }
            
            this.loaded = true;
            if (registered) {
              this.accountInfo.setValue({
                walletAddress: this.walletAddress,
                email: user_.email,
                nickName: user_.nick
              });              
              this.authService.login();
              setTimeout(() => {
                this.metaMaskService.getAccountInfo();
                this.UpdateNickName(user_.nick);
              }, 500);            
            } else {
              this.accountInfo.setValue({
                walletAddress: this.walletAddress,
                email: this.email,
                nickName: this.nickName
              });
            }
          }
        }
      });
    });
  }

  createForm() {
    this.accountInfo = this.fb.group({
      walletAddress: [{value: this.walletAddress, disabled: true}],
      email: [this.email, Validators.required ],
      nickName: this.nickName,
    });
  }

  onSaveInfo() {
    if (this.email === '' ) {
      this.isEmailed = false;
      return;
    }

    if (!this.emailValidationExpression.test(this.email.toLowerCase())) {
      this.isValidEmail = false;
      return;
    }

    this.isEmailed = true;
    this.isValidEmail = true;
    this.isSaving = true;
    setTimeout(() => {
      this.UpdateNickName(this.nickName);
      this.metaMaskService.SignInTransaction()
      .then(result => {
        const data = {
          'nick': this.nickName,
          'email': this.email,
          'type': 'user',
          'gzr': {
              'type': 'wallet',
              'id': result['account']
          }
        };
        this.authService.login();
        setTimeout(() => {
          this.metaMaskService.getAccountInfo();
          this.UpdateNickName(this.nickName);
        }, 500);

        this.userService.registerUser(data)
        .subscribe(
        );
      })
      .catch(error => {
        this.isEmailed = false;
      });
    }, 3000);
  }

  UpdateNickName(data) {
    this.store.dispatch({type: UPDATE_NICK_NAME, payload: data});
  }

  navigateToMetaMask() {
    this.router.navigate(['/meta-mask']);
  }
}
