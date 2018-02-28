import { Injectable } from '@angular/core';
import { LocalStoragePersistance } from '../../../core/localstorage.persistance.service';

@Injectable()
export class UserLocalstorageRepository {

    private _key = 'userid';

    public constructor(private _localStoragePersistance: LocalStoragePersistance) {}

    public setUserId(userId: string): boolean {
        return this._localStoragePersistance.add(this._key, userId);
    }

    public getUserId(): string {
        return this._localStoragePersistance.get(this._key);
    }

    public deleteUserId(): boolean {
        return this._localStoragePersistance.delete(this._key);
    }
}
