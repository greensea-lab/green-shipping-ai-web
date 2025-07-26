import React from 'react';
import { Card, Button, Space } from 'antd';

const MyComponent: React.FC = () => {
  const handleClick = () => {
    alert('안녕하세요! 이것은 제가 만든 첫 번째 컴포넌트입니다! 🎉');
  };

  return (
    <Card title="내가 만든 컴포넌트" style={{ margin: '16px 0' }}>
      <p>이것은 제가 직접 만든 컴포넌트입니다!</p>
      <Space>
        <Button type="primary" onClick={handleClick}>
          클릭해보세요!
        </Button>
        <Button>다른 버튼</Button>
      </Space>
    </Card>
  );
};

export default MyComponent;
