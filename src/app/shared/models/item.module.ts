export class Item {
    id: string;
    resources: {
        icons: [string];
        images: [string];
        videos: [string];
        model: [string];
    };
    current: {
        status: string;
        likes: string;
        similar: [string];
    };
    meta: {
        name: string;
        description: string;
        wallet: string;
        use: string;
        category: string;
        rarity: string;
        origin: string;
        released: string;
        unlocked: string;
        collection: string;
        series: {
            item: number;
            of: number;
        }
    };
    constructor() {
        this.id = '';
        this.resources = {
            icons: [''],
            images: [''],
            videos: [''],
            model: [''],
        };
        this.current = {
            status: '',
            likes: '',
            similar: [''],
        };
        this.meta = {
            name: '',
            description: '',
            wallet: '',
            use: '',
            category: '',
            rarity: '',
            origin: '',
            released: '',
            unlocked: '',
            collection: '',
            series: {
                item: 0,
                of: 0
            }
        };
    }
}
