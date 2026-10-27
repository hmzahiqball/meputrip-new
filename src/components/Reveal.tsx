import { createElement, type CSSProperties, type HTMLAttributes } from "react";
import { useInViewOnce } from "../hooks/useInViewOnce";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "section" | "article" | "figure";
  delay?: number;
};

/** Retains the semantic element and layout, with no extra wrapper in the DOM. */
export default function Reveal({
  as = "div",
  className = "",
  delay,
  style,
  children,
  ...props
}: RevealProps) {
  const { ref, visible } = useInViewOnce();
  const revealStyle: CSSProperties = {
    ...style,
    ...(delay === undefined ? {} : { "--reveal-delay": `${delay}ms` }),
  };
  return createElement(
    as,
    {
      ...props,
      ref,
      className: `reveal ${className}`.trim(),
      style: revealStyle,
      "data-reveal": visible ? "visible" : "pending",
    },
    children,
  );
}
