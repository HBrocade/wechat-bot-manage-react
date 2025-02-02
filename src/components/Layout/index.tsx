import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Breadcrumb, Row, Col } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import routes from '../../routes/config';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const breadcrumbItems = [{ title: '首页', path: '/' }];

    pathSnippets.forEach((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const route = routes.find(r => r.path === url);
      if (route && route.breadcrumb) {
        breadcrumbItems.push({
          title: route.breadcrumb,
          path: url
        });
      }
    });

    return breadcrumbItems.map((item) => ({
      title: <span onClick={() => navigate(item.path)} style={{ cursor: 'pointer' }}>{item.title}</span>
    }));
  };

  const menuItems = routes.map(route => ({
    key: route.key,
    icon: route.icon ? React.createElement(route.icon) : null,
    label: route.label,
    onClick: () => navigate(route.path)
  }));

  return (
    <Layout style={{ minHeight: '100vh', minWidth: '75rem', maxWidth: '120rem', margin: '0 auto' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ minHeight: '100vh' }} width={220}>
        <div style={{ height: '2rem', margin: '1rem', background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, height: '64px', lineHeight: '64px', display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '1rem', width: '4rem', height: '4rem' }}
          />
          <Breadcrumb style={{ margin: '0 1.5rem' }} items={getBreadcrumbItems()} />
        </Header>
        <Content
          style={{
            margin: '1.5rem',
            padding: '1.5rem',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 'calc(100vh - 7rem)',
            overflow: 'auto'
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Outlet />
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;