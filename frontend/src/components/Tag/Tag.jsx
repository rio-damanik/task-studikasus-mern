// src/components/Tag/Tag.jsx

import React from "react";
import "./Tag.css";

const Tag = ({ tags, onTagSelect }) => {
  return (
    <div className="tag-container">
      <h2>Tags</h2>
      <ul className="tag-list">
        {tags.map((tag, index) => (
          <li key={index}>
            <button className="tag-button" onClick={() => onTagSelect(tag)}>
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tag;
