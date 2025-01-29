import { createElement } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useRef, useEffect } from 'preact/hooks';
import { detectStyleChange, style, styleToString, toStyle } from "../lib/utils/tbstyle.ts";

interface ITextFunctions {
  style: style;
  defaults: style;
  type: 'color' | 'size' | 'bold' | 'italic' | 'underline' | 'strike';
  selection: Selection;
  ref: HTMLDivElement
}

export default function Test() {
  const text = useSignal<string>(`
        <div class="soc"><span style="color: white">12345</span><span style="color: lime">67890</span><span style="color: red">12345</span><span style="color: yellow">67890</span></div>
        <div class="soc"><span style="color: white">12345</span><span style="color: lime">67890</span><span style="color: red">12345</span><span style="color: yellow">67890</span></div>
        <div class="soc"><span style="color: white">123456789</span><span style="color: cyan; font-weight: bold">123456789</span><span style="color: purple">123456789</span></div>
        <div class="soc">
          <span style="color: white">hello? </span>
          <span style="color: rebeccapurple">it's me </span>
          <span style="color: white">I was wondering </span>
          <span style="color: green; font-weight: bold;">if after all </span>
          <span style="color: seagreen;">these years </span>
          <span style="color: red">you'd </span>
          <span style="color: red; font-weight: bold;">like to meet </span>
          <span style="color: white">to go over </span>
          <span style="color: orange">everything</span>
        </div>`);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current!.innerHTML = text.value;
  }, []);

  const pBlock = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    const selection = globalThis.getSelection();
    const childrenArray = Array.from(ref.current!.children || []);
    const startIndex = childrenArray.findIndex(
      (child) => child === selection!.getRangeAt(0).startContainer || child.contains(selection!.getRangeAt(0).startContainer)
    );

    const childrenArray0 = Array.from(childrenArray[startIndex].children || []);
    const startIndex0 = childrenArray.findIndex(
      (child) => child === selection!.getRangeAt(0).startContainer || child.contains(selection!.getRangeAt(0).startContainer)
    );

    const styleDef: style = {
      color: 'white',
      size: undefined,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
    }

    if (selection  && ref.current) {
      const range = selection.getRangeAt(0);
      const newSetStyle: ITextFunctions = {
        style: {},
        defaults: styleDef,
        type: "color",
        selection: selection,
        ref: ref.current
      }
  
      if (e.key === "Enter") {
        e.preventDefault();
        const currentStyle = toStyle(selection.anchorNode?.parentElement?.style)
        // selection!.getRangeAt(0)

        const newLine = document.createElement('div')
        const newBlock = document.createElement("span");
        newBlock.innerText = "\n"
        newBlock.setAttribute('style', styleToString(currentStyle)!)

        if (startIndex < childrenArray.length-1)
          ref.current.insertBefore(newLine, ref.current.children[startIndex + 1])
        else
          ref.current.insertBefore(newLine, null)

        range.setStart(newLine, 0);
        range.setEnd(newLine, 0);
        selection.removeAllRanges();
        selection.addRange(range);

        range.deleteContents();
        range.insertNode(newBlock);

        range.setStart(newBlock, 0);
        range.setEnd(newBlock, 0);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      if (e.code == 'KeyB' && e.ctrlKey) {
        e.preventDefault();

        newSetStyle.type = "bold"
        newSetStyle.style.bold = true
        setStyle({...newSetStyle})
      }

      if (e.code == 'KeyI' && e.ctrlKey) {
        e.preventDefault();

        newSetStyle.type = "italic"
        newSetStyle.style.italic = true
        setStyle({...newSetStyle})
      }

      if (e.code == 'KeyU' && e.ctrlKey) {
        e.preventDefault();

        newSetStyle.type = "underline"
        newSetStyle.style.underline = true
        setStyle({...newSetStyle})
      }

      if (e.code == 'KeyQ' && e.ctrlKey) {
        e.preventDefault();

        newSetStyle.type = "strike"
        newSetStyle.style.strike = true
        setStyle({...newSetStyle})
      }

    }
  };

  return (
    <div class="div">
      <link rel="stylesheet" href="/styles/test.css" />
      <div
      contentEditable={true}
      tabindex={0}
      ref={ref}
      onKeyDown={(e) => {pBlock(e)}}
      onInput={(e) => {
        text.value = e.currentTarget.innerHTML || "";
      }}

      onPaste={(e) => {
        e.preventDefault();
        const plainText = e.clipboardData?.getData("text/plain") || "";
        document.execCommand("insertText", false, plainText);
      }}
      >
      </div>
    </div>
  );
}

function setStyle(props: ITextFunctions) {
  const { style, selection, type, ref } = props;

  const range = selection.getRangeAt(0);
  const childrenArray = Array.from(ref.children || []);

  const startIndex = childrenArray.findIndex(
    (child) => child === range.startContainer || child.contains(range.startContainer)
  );
  
  const endIndex = childrenArray.findIndex(
    (child) => child === range.endContainer || child.contains(range.endContainer)
  );

  let currentStyle = style
  if (toStyle(range.startContainer.parentElement?.style)![type as keyof style] === style[type as keyof style] &&
  toStyle(range.endContainer.parentElement?.style)![type as keyof style] === style[type as keyof style])
    currentStyle[type as keyof style] = props.defaults[type as keyof style]

  const extracted = range.extractContents()
  const pArray = Array.from(extracted.children || []) as HTMLElement[];
  
  const loop = (pArray: HTMLElement[]) => {
    let currentNode = document.createElement('span')
    const newNodes: HTMLSpanElement[] = []

    pArray.forEach((item, index) => {
      const thisStyle = toStyle(item.style)!
      thisStyle[type as keyof style] = style[type as keyof style]
      
      if(index === 0) {
        if(detectStyleChange(currentStyle, thisStyle, props.type)) currentStyle = thisStyle

        currentNode.setAttribute('style', styleToString(currentStyle)!)
        currentNode.textContent += item.textContent!
      }
      else if(index === pArray.length - 1) {
        if(detectStyleChange(currentStyle, thisStyle, props.type)){
          currentStyle = thisStyle
          newNodes.push(currentNode)

          currentNode = document.createElement('span')
          currentNode.setAttribute('style', styleToString(currentStyle)!)
        }

        currentNode.textContent += item.textContent!
        newNodes.push(currentNode)
      }
      else {
        if(detectStyleChange(currentStyle, thisStyle, props.type)){
          currentStyle = thisStyle
          newNodes.push(currentNode)

          currentNode = document.createElement('span')
          currentNode.setAttribute('style', styleToString(currentStyle)!)
        }

        currentNode.textContent += item.textContent!
      }
    })

    return newNodes
  }

  // Case 1: Style is applied within a single element
  if (startIndex === endIndex) {   
    const currentNode = document.createElement('span')

    if (pArray.length > 0) {
      const newNodes: HTMLSpanElement[] = loop(pArray)

      range.deleteContents();
      newNodes.forEach((node) => {
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
      });

      selection.removeAllRanges();
      selection.addRange(range);
    }
    else {
      currentNode.textContent = extracted.textContent
      const newStyle = toStyle(range.startContainer.parentElement?.style)!
      newStyle[type as keyof style] = currentStyle[type as keyof style]
      currentNode.setAttribute('style', styleToString(newStyle)!)
      range.insertNode(currentNode);
    }
  }
  else {
    pArray.forEach((container, index) => {
      const childrenArray = Array.from(ref.children || []);
      const cArray = Array.from(container.children || []) as HTMLElement[];
      const newNodes: HTMLSpanElement[] = loop(cArray)

      if (index === 0) {
        
        range.selectNodeContents(childrenArray[startIndex + index]);
        range.collapse(false);
      }
      else if (index === pArray.length - 1){
        range.selectNodeContents(childrenArray[startIndex + index]);
        range.setStart(childrenArray[startIndex + index], 0);
        range.setEnd(childrenArray[startIndex + index], 0);
        range.collapse(false);
      }
      else {
        const ind = startIndex + index - 1
        range.selectNodeContents(childrenArray[ind]);
        range.setStartAfter(childrenArray[ind]);
        range.setEndAfter(childrenArray[ind]);

        const newDiv = document.createElement('div')
        range.insertNode(newDiv);
        range.selectNodeContents(newDiv);
        range.collapse(false);
      }

      if(cArray.length > 1)
        newNodes.forEach((node) => {
          range.insertNode(node);
          range.setStartAfter(node);
          range.setEndAfter(node);
        });
      else {
        const currentNode = document.createElement('span')
        currentNode.textContent = container.textContent
        currentNode.setAttribute('style', styleToString(currentStyle)!)
        range.insertNode(currentNode);
      }

      selection.removeAllRanges();
      selection.addRange(range);
    })
  }
}

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