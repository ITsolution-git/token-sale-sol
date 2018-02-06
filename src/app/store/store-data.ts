export interface UserState {
    installed: boolean;
    unlocked: boolean;
    showAddressForm: boolean;
    walletAddress: String;
    balance: number;
    gzrBalance: number;
    transactionId: String;
}

export const INITIAL_USER_STATE: UserState = {
    installed: null,
    unlocked: true,
    showAddressForm: false,
    walletAddress: '',
    balance: 0,
    gzrBalance: 0,
    transactionId: ''
};
