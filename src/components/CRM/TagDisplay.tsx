import React from "react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagDisplayProps {
  tag: Tag;
}

const TagDisplay: React.FC<TagDisplayProps> = ({ tag }) => {
  return (
    <div 
      className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
      style={{ 
        backgroundColor: `${tag.color}20`, // 20% opacity
        color: tag.color,
        border: `1px solid ${tag.color}40` // 40% opacity
      }}
    >
      {tag.name}
    </div>
  );
};

export default TagDisplay; 