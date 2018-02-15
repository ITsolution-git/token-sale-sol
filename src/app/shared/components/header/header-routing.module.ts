import { RouteInfo } from './header.metadata';

export const HeaderRoutes: RouteInfo[] = [
  { path: '', title: 'Home', fragment: 'home', id: 'home-navbar' },
  { path: '/buy-gzr', title: 'Get GZR', fragment: '', id: 'getgzr-navbar'},
  { path: '/my-items', title: 'My Profile', fragment: '', id: 'myprofile-navbar'}
];

export const MobileHeaderRoutes: RouteInfo[] = [
  { path: '', title: 'Home', fragment: 'home', id: 'home-navbar'},
  { path: '/buy-gzr', title: 'Get GZR', fragment: '', id: 'getgzr-navbar'},
  { path: '/faq', title: 'FAQ', fragment: '', id: 'faq-navbar'},
];
