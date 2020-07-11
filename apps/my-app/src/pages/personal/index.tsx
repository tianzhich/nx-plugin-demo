import React from 'react';

import { RouteComponentProps, Link } from 'react-router-dom';
import './index.scss';
import { ReactComponent as Logo } from '../../app/logo.svg';

type Props = RouteComponentProps;

const Personal = (props: Props) => {
  return (
    <div className="my-app-personal">
      <header className="flex">
        <Logo width="75" height="75" />
        <h1>Welcome to my-app-personal page!</h1>
      </header>
      <Link to="/">Click here for home page.</Link>
    </div>
  );
};

export default Personal;
