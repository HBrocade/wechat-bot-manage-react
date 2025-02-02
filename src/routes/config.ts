import { DashboardOutlined } from '@ant-design/icons';
import { lazy } from 'react';

export interface RouteConfig {
  key: string;
  path: string;
  label: string;
  icon?: React.ComponentType;
  component: React.LazyExoticComponent<React.ComponentType>;
  children?: RouteConfig[];
  breadcrumb?: string;
}

const routes: RouteConfig[] = [
  {
    key: 'dashboard',
    path: '/dashboard',
    label: '仪表盘',
    icon: DashboardOutlined,
    component: lazy(() => import('../pages/Dashboard')),
    breadcrumb: '仪表盘'
  }
];

export default routes;