import React from "react";

type BoxProps = {
  link: string;
  children: React.ReactNode;
  href: string;
  target: string;
  className: string;
  style: any;
};

const Box = ({ link, children, ...props }: BoxProps) => {
  return React.createElement(link ? "a" : "div", props, children);
};

export default Box;
