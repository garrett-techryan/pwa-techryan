// src/components/Card.jsx
import React from "react";

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow p-4 w-full">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    {children}
  </div>
);

export default Card;