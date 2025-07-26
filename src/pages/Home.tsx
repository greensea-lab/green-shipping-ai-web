import React from 'react';
import HelloAntd from '../components/HelloAntd';
import EnvironmentInfo from '../components/EnvironmentInfo';
import MyComponent from '../components/MyComponent';

const Home: React.FC = () => {
  return (
    <div>
      <h2>안녕하세요! 🎉</h2>
      <p>이곳은 제가 만든 첫 번째 웹페이지입니다.</p>
      <HelloAntd />
      <EnvironmentInfo />
      <MyComponent />
    </div>
  );
};

export default Home;
