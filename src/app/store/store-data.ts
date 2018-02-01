export interface UserState {
    installed: boolean;
    unlocked: boolean;
    walletAddress: String;
    balance: number;
    gzrBalance: number;
}

export const INITIAL_USER_STATE: UserState = {
    installed: false,
    unlocked: true,
    walletAddress: '',
    balance: 0,
    gzrBalance: 0
};
