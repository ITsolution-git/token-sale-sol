import { UserState, INITIAL_USER_STATE } from './store-data';

export interface ApplicationState {
    userState: UserState;
}

export const INITIAL_APPLICATION_STATE: ApplicationState = {
    userState: INITIAL_USER_STATE
};
