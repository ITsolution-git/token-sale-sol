export interface UserState {
    installed: boolean;
    unlocked: boolean;
    walletAddress: String;
    balance: number;
}

export const INITIAL_USER_STATE: UserState = {
    installed: false,
    unlocked: true,
    walletAddress: '',
    balance: 0
};
