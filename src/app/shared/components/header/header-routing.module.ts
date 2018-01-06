import { MenuType, RouteInfo } from './header.metadata';

export const ROUTES: RouteInfo[] = [
  { path: '', title: 'Home', menuType: MenuType.LEFT },
  { path: 'get-gzr', title: 'Get GZR', menuType: MenuType.RIGHT },
  { path: 'items', title: 'Items', menuType: MenuType.RIGHT }
];
