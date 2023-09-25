

// import React, { ReactNode } from 'react';
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import '../styles/root.css';

type RootProps = {
  children: ReactNode;
};

export default function Root({ children }: RootProps) {
  return (
    <>
      <Header />
      <Sidebar />
      <div className='content'>{children}</div>
    </>
  );
}
