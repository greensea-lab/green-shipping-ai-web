import React from 'react';
import { Card, Tag, Typography } from 'antd';
import config from '../config/environment';

const { Text } = Typography;

const EnvironmentInfo: React.FC = () => {
  const getEnvColor = (env: string) => {
    switch (env) {
      case 'local':
        return 'blue';
      case 'development':
        return 'orange';
      case 'production':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Card title="환경 정보" style={{ margin: '16px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <Text strong>환경: </Text>
          <Tag color={getEnvColor(config.env)}>{config.env.toUpperCase()}</Tag>
        </div>
        <div>
          <Text strong>앱 이름: </Text>
          <Text>{config.appName}</Text>
        </div>
        <div>
          <Text strong>버전: </Text>
          <Text>{config.version}</Text>
        </div>
        <div>
          <Text strong>API URL: </Text>
          <Text code>{config.apiUrl}</Text>
        </div>
        <div>
          <Text strong>디버그 모드: </Text>
          <Tag color={config.debug ? 'red' : 'green'}>
            {config.debug ? 'ON' : 'OFF'}
          </Tag>
        </div>
      </div>
    </Card>
  );
};

export default EnvironmentInfo;
