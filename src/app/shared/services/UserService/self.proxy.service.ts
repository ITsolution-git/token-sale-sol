import { UserService } from './user.service';
import { UserInterface } from '../../models/user.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class SelfService extends UserService {

    private self: UserInterface;

    public set(User: UserInterface): void {
        this.self = User;
    }

    public get(): UserInterface {
        if (this.self.id != null) { return this.self; }

    }
}
