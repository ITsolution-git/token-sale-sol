import { RouteInfo } from './header.metadata';

export const HeaderRoutes: RouteInfo[] = [
  { path: '', title: 'Home', fragment: 'home' },
  { path: '/buy-gzr', title: 'Get GZR', fragment: ''},
  // { path: '/profile', title: 'My Profile', fragment: ''},
];

export const MobileHeaderRoutes: RouteInfo[] = [
  { path: '', title: 'Home', fragment: 'home'},
  { path: '/buy-gzr', title: 'Get GZR', fragment: ''},
  { path: '/faq', title: 'FAQ', fragment: ''},
];
