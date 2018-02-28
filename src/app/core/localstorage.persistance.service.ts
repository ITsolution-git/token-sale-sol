import { Injectable } from '@angular/core';


@Injectable()
export class LocalStoragePersistance {

private storage = window.localStorage;

public add(index: string, payload: string): boolean {
this.storage.setItem(index, payload);
if (this.storage.getItem(index) === payload) {return true; }
return false;
}

public get(index: string): string {
    return this.get(index);
}

public delete(index: string): boolean {
    return this.delete(index);
}
}
