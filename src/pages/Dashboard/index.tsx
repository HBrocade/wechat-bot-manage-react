import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总用户数"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="消息数量"
              value={93}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="活跃群组"
              value={12}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;