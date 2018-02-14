export enum MenuType {
    BRAND,
    LEFT,
    RIGHT
}

export interface RouteInfo {
    id: string;
    path: string;
    title: string;
    fragment: string;
}
