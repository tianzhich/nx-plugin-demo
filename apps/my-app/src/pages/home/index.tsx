import React from 'react';
import './index.scss';
import { ReactComponent as Logo } from '../../app/logo.svg';

export default () => {
  return (
    <div className="home">
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>Welcome to home page!</h1>
      </header>
    </div>
  );
};
