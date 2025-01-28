export type style = {
  color?: string;
  size?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;

  [key: string]: string | boolean | undefined;
};

// Utility function to convert CSS style to a style object
export const toStyle = (style?: CSSStyleDeclaration | null): style | null => {
  if (!style) return null;

  return {
    color: style.color || undefined,
    size: style.fontSize || undefined,
    bold: style.fontWeight === "bold",
    italic: style.fontStyle === "italic",
    underline: style.textDecoration.includes("underline"),
    strike: style.textDecoration.includes("line-through"),
  };
};

// Utility function to convert a style object to an HTML tag
export const styleToTag = (style: style | null): string | null => {
  if (!style) return null;

  const styleString = `
      ${style.color ? `color: ${style.color};` : ""}
      ${style.size ? `font-size: ${style.size};` : ""}
      ${style.bold ? `font-weight: bold;` : ""}
      ${style.italic ? `font-style: italic;` : ""}
      ${
    style.underline || style.strike
      ? `text-decoration: ${style.underline ? "underline" : ""} ${
        style.strike ? "line-through" : ""
      };`
      : ""
  }
    `.trim();

  return `<span style="${styleString}">`;
};

// Utility function to clean up text content of a node
export const cleanUpNode = (
  node: HTMLElement | Node,
  className: string,
): void => {
    console.log(node)
    if (node instanceof HTMLElement && node.classList[0] !== className) {
        node.remove();
    } else {
        node.textContent = "";
    }
};

export function detectStyleChange(current: style, newStyle: style, attr: string): boolean {
    let arr = ["color", "size", "bold", "italic", "underline", "strike"]
    arr.splice(arr.indexOf(attr), 1)

    const styleKeys: (keyof style)[] = arr;
    return styleKeys.some((key) => current[key] !== newStyle[key]);
}