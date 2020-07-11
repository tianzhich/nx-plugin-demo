import React from 'react';
import './app.css';
import { Route, Link } from 'react-router-dom';
import { routers } from '../routers/config';
import loadable from '@loadable/component';

export const App = () => {
  return (
    <div className="app">
      <div role="navigation">
        <ul>
          {Object.keys(routers).map((path) => (
            <li key={path}>
              <Link to={path}>{routers[path]}</Link>
            </li>
          ))}
        </ul>
      </div>
      {Object.keys(routers).map((path) => (
        <Route
          key={path}
          path={path}
          exact
          component={loadable(() => import(`../pages/${routers[path]}`))}
        />
      ))}
    </div>
  );
};

export default App;
