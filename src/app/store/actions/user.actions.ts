import { Action } from '@ngrx/store';

export const UPDATE_INSTALL_STATUS = 'UPDATE_INSTALL_STATUS';
export const UPDATE_LOCK_STATUS = 'UPDATE_LOCK_STATUS';
export const UPDATE_WALLET_ADDRESS = 'UPDATE_WALLET_ADDRESS';
export const UPDATE_GZR_BALANCE = 'UPDATE_GZR_BALANCE';

export class UpdateInstallStatus implements Action {
    readonly type = UPDATE_INSTALL_STATUS;

    constructor(public payload: boolean) {
    }
}

export class UpdateLockStatus implements Action {
    readonly type = UPDATE_LOCK_STATUS;

    constructor(public payload: boolean) {
    }
}

export class UpdateWallet implements Action {
    readonly type = UPDATE_WALLET_ADDRESS;

    constructor(public payload: String) {
    }
}

export class UpdateGzrBalance implements Action {
    readonly type = UPDATE_GZR_BALANCE;

    constructor(public payload: boolean) {
    }
}

export type All = UpdateInstallStatus | UpdateLockStatus | UpdateWallet | UpdateGzrBalance;
