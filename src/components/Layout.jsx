import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <h1>Finanças para Motoristas de APP</h1>
      </header>
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
