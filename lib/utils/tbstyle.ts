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
export const toStyle = (style?: CSSStyleDeclaration): style | null => {
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

export const styleToString = (style: style | null): string => {
  if (!style) return '';

  let styleString = ''

  styleString +=  `${style.color ? `color: ${style.color};` : ""}`
  styleString +=  `${style.size ? `font-size: ${style.size};` : ""}`
  styleString +=  `${style.bold ? `font-weight: bold;` : ""}`
  styleString +=  `${style.italic ? `font-style: italic;` : ""}`
  styleString +=  `${style.underline || style.strike? `text-decoration: ${style.underline ? "underline" : ""} ${style.strike ? "line-through" : ""};`: ""}`

  return styleString
};

export function detectStyleChange(current: style, newStyle: style, attr?: string): boolean {
    const arr = ["color", "size", "bold", "italic", "underline", "strike"]
    
    if(attr)
      arr.splice(arr.indexOf(attr), 1)

    const styleKeys: (keyof style)[] = arr;
    return styleKeys.some((key) => current[key] !== newStyle[key]);
}

type Tag = {
  tag: string;
  style: style
  content?: string;
  children?: HtmlNode[];
};

export const styleToJSON = (element: HTMLElement): Tag => {
  const tag = {
    tag: '',
    style: {}
  }

  return tag
};



type HtmlNode = {
  tag: string; // Tag name
  attributes: { [key: string]: string }; // Attributes as key-value pairs
  children: HtmlNode[]; // Child nodes
  content?: string; // Optional text content
};

function htmlToJson(element: Element): HtmlNode {
  const node: HtmlNode = {
      tag: element.tagName.toLowerCase(),
      attributes: {},
      children: []
  };

  // Add attributes
  for (const attr of element.attributes) {
      node.attributes[attr.name] = attr.value;
  }

  // Add text content if it's a text-only node
  if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
      node.content = element.textContent?.trim();
  }

  // Recursively process child elements
  for (const child of Array.from(element.children)) {
      node.children.push(htmlToJson(child));
  }

  return node;
}

function jsonToHtml(node: HtmlNode): string {
  // Start with the opening tag and its attributes
  const attributes = node.attributes
      ? Object.entries(node.attributes)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join("")
      : "";

  // Handle content or children
  let content = "";

  if (node.children && node.children.length > 0) {
      // Recursively process children
      content = node.children.map(jsonToHtml).join("");
  } else if (node.content) {
      // Add text content if no children exist
      content = node.content;
  }

  // Self-closing tag if no children or content
  if (!content) {
      return `<${node.tag}${attributes} />`;
  }

  // Return full tag with content
  return `<${node.tag}${attributes}>${content}</${node.tag}>`;
}