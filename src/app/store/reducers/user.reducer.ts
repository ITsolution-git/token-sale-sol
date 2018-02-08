import { UserState, INITIAL_USER_STATE } from '../store-data';
import * as UserActions from '../actions/user.actions';

export type Action = UserActions.All;

export function userReducer(state: UserState = INITIAL_USER_STATE, action: Action) {
    switch (action.type) {

        case UserActions.UPDATE_INSTALL_STATUS:
            return { ...state, installed: action.payload };

        case UserActions.UPDATE_LOCK_STATUS:
            return { ...state, unlocked: action.payload };

        case UserActions.UPDATE_NICK_NAME:
            return { ...state, nickName: action.payload };

        case UserActions.UPDATE_WALLET_ADDRESS:
            return { ...state, walletAddress: action.payload };

        case UserActions.UPDATE_BALANCE:
            return { ...state, balance: action.payload };

        case UserActions.UPDATE_GZR_BALANCE:
            return { ...state, gzrBalance: action.payload };

        case UserActions.UPDATE_SHOW_ADDRESS_FORM:
            return { ...state, showAddressForm: action.payload };

        case UserActions.UPDATE_TRANSACTION_ID:
            return { ...state, transactionId: action.payload };

        default: {
            return state;
        }
    }
}
