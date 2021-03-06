export interface UserInterface {
 id: string;
 nick: string;
 email: string;
 type: string;
 username: string;
 password: string;
 active: boolean;
 address: Address;
 about: string;
 reputation: number;
 timezone: string;
 seen: string;
 registered: string;
 interests: Array<string>;
 gzr: Gzr;
 boosts: number;
 avatar: Avatar;
 social: Array<SocialItem>;
 knows: Array<string>;
 owns: Array<string>;
}

interface Address {
    street: string;
    city: string;
    Country: string;
}

interface Gzr {
    type: string;
    id: string;
    amount: number;
}

interface Avatar {
    type: string;
    url: string;
}

interface SocialItem {
    name: string;
    url: string;
}
