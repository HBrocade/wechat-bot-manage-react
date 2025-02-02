import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { lazy } from 'react';
import PrivateRoute from '../components/PrivateRoute';
import routes from './config';

// 懒加载页面组件
const Login = lazy(() => import('../pages/Login'));
const Layout = lazy(() => import('../components/Layout'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

// 动态生成路由配置
const generateRoutes = () => {
    // 将动态路由添加到路由配置中
    const routeChildren = routes.map(route => ({
        path: route.path,
        element: <PrivateRoute><route.component /></PrivateRoute>,
        breadcrumb: route.breadcrumb
    }));

    return createBrowserRouter([
        {
            element: <AuthProvider><Outlet /></AuthProvider>,
            children: [
                {
                    path: '/login',
                    element: <Login />
                },
                {
                    path: '/',
                    element: <PrivateRoute><Layout /></PrivateRoute>,
                    children: [
                        {
                            path: '',
                            element: <Navigate to="/dashboard" replace />
                        },
                        {
                            path: 'dashboard',
                            element: <PrivateRoute><Dashboard /></PrivateRoute>,
                            breadcrumb: '仪表盘'
                        },
                        ...routeChildren
                    ]
                }
            ]
        }
    ]);
}

export default generateRoutes();
