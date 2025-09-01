import React from 'react';
import HelloAntd from '../components/HelloAntd';
import EnvironmentInfo from '../components/EnvironmentInfo';

const Home: React.FC = () => {
  return (
    <div>
      <h2>안녕하세요! 🎉</h2>
      <p>이곳은 제가 만든 첫 번째 웹페이지입니다.</p>
      <HelloAntd />
      <EnvironmentInfo />
    </div>
  );
};

export default Home;
