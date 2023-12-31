// import React, { ReactNode } from 'react';
import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "../styles/root.css";

type RootProps = {
  children: ReactNode;
};

export default function Root({ children }: RootProps) {
  return (
    <>
      <Header />
      <div className="sidebar-layout">
        <Sidebar />
        <div style={{ width: "100%", height: "100%" }}>{children}</div>
      </div>
    </>
  );
}
