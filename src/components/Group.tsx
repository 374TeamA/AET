import React from "react";
import "./group.css";

interface GroupProps {
  children: React.ReactNode;
  label?: string;
}

export default function Group({ children, label }: GroupProps) {
  return (
    <div className="group-container">
      <p className="group-label">{label}</p>
      {children}
    </div>
  );
}
