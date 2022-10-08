import React, { memo } from "react";

interface ITodoTitleProps {
  title: string;
}

const TodoTitle: React.FC<ITodoTitleProps> = (props) => {
  console.log("render title");
  return <div>{props.title}</div>;
};

export default memo(TodoTitle);
