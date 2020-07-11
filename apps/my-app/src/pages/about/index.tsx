import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../../app/logo.svg';

export default () => {
  return (
    <div className="about">
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>Welcome to about page!</h1>
      </header>
      <Link to="/">Click here for home page.</Link>
    </div>
  );
};
