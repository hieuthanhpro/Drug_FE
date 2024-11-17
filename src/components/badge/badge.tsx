import React from "react";
import "./badge.scss";

interface BadgeProps {
  text: string;
  variant: "error" | "success" | "warning" | "primary";
}

export default function Badge(props: BadgeProps) {
  const { text, variant } = props;
  return <span className={`base-badge base-badge--${variant ?? "primary"}`}>{text}</span>;
}
