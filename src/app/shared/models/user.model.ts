interface Social {
  name: string;
  url: string;
}

interface Avatar {
  type: string;
  uri: string;
}

interface Gzr {
  type: string;
  id: string;
  amount: number;
}

interface Address {
  street: string;
  city: string;
  Country: string;
}

export class User {
  id: string;
  nick: string;
  email: string;
  type: string;
  username: string;
  password: string;
  active: number;
  address: Address;
  about: string;
  reputation: number;
  timezone: string;
  seen: string;
  registered: string;
  interests: string[];
  gzr: Gzr;
  boosts: number;
  avatar: Avatar;
  social: Social[];
  knows: string[];
  owns: string[];
  constructor() {
    this.id = '1dab3646-e2da-01e7-2c3a-1a294xa092aw';
    this.nick = 'Johny Bravo';
    this.email = 'johny@bravo.io';
    this.type = 'user';
    this.username = 'jbravo';
    this.password = 'hashed';
    this.active = 1;
    this.address.street = '7th & 45th, Manhattan';
    this.address.city = 'NYC';
    this.address.Country = 'USA';
    this.about = 'I am a hardcore player!';
    this.reputation = 21000;
    this.timezone = 'UTC';
    this.seen = '2013-03-01T01:10:00';
    this.registered = '2013-03-01T01:10:00';
    this.interests = ['Fishing', 'Bowling', 'Dodgeball'];
    this.gzr.type = 'wallet';
    this.gzr.id = '1dab3646-e2da-01e7-2c3a-1a294xa092aw';
    this.gzr.amount = 130;
    this.boosts = 25200;
    this.avatar.type = '2d';
    this.avatar.uri = 'http://s3.amazonaws.com/gizer/avatars/clown.jpg';
    this.social = [{
        name: 'google+',
        url: 'https://plus.google.com/11730245375828271109'
      },
      {
        name: 'facebook',
        url: 'https://www.facebook.com/jbravo'
      }
    ];
    this.knows = [
        '1dab3646-e2da-01e7-2c3a-1a294xa092aw',
        '1dab3646-e2da-01e7-2c3a-1a294xa092aw',
        '1dab3646-e2da-01e7-2c3a-1a294xa092aw',
        '1dab3646-e2da-01e7-2c3a-1a294xa092aw'
    ];
    this.owns = [
        'item/1dab3646-e2da-01e7-2c3a-1a294xa092aw',
        'item/1dab3646-e2da-01e7-2c3a-1a294xa092aw',
        'item/1dab3646-e2da-01e7-2c3a-1a294xa092aw'
    ];
  }
}
