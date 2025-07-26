import React from 'react';
import { Layout, Typography } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 50px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <Title
              level={3}
              style={{ margin: '16px 0', color: '#1890ff', flex: 1 }}
            >
              <Link to="/" style={{ color: '#1890ff' }}>
                Green Shipping AI
              </Link>
            </Title>
          </div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Green Shipping AI ©2024 Created with React + TypeScript + Ant Design
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
