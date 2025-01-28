import { createElement } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useRef, useEffect } from 'preact/hooks';
import { cleanUpNode, detectStyleChange, style, styleToString, styleToTag, toStyle } from "../lib/utils/tbstyle.ts";
import { rangeIntersects } from "$std/semver/range_intersects.ts";
import { copySync } from "$std/fs/copy.ts";

interface ITextFunctions {
  style: style;
  defaults: style;
  type: 'color' | 'size' | 'bold' | 'italic' | 'underline' | 'strike';
  range: Range;
  selection: Selection;
  childrenArray: Element[];

  startIndex: number;
  startElement: HTMLElement;
  startContainer: Node;
  startOffset: number;

  endIndex: number;
  endElement: HTMLElement;
  endContainer: Node;
  endOffset: number;
}

export default function Test() {
  const text = useSignal<string>(`
        <div class="soc"><span style="color: white">123</span></div>
        <div class="soc"><span style="color: white">12345</span><span style="color: lime">67890</span><span style="color: red">12345</span><span style="color: yellow">67890</span></div>
        <div class="soc"><span style="color: white">123456789</span><span style="color: cyan">123456789</span></div>
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
    const nodeArray = Array.from(ref.current?.childNodes || []);
    const childrenArray = Array.from(ref.current?.children || []);

    const styleDef: style = {
      color: 'white',
      size: undefined,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
    }

    const newStyle: style = {
      color: 'pink',
      size: undefined,
      bold: false,
      italic: false,
      underline: false,
      strike: false,
    }

    const keyPattern = new RegExp(/(Digit[0-9]|Numpad[0-9])|(Key[a-zA-Z])|(Bracket|Slash|slash|colon|Quote|quote|Comma|Period|Minus|Equal)/g)
    // console.log(keyPattern.test(e.code), e.code, e.key, e.metaKey)

    if (selection  && ref.current) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      const startIndex = childrenArray.findIndex(
        (child) => child === startContainer || child.contains(startContainer)
      );
      
      const endIndex = childrenArray.findIndex(
        (child) => child === endContainer || child.contains(endContainer)
      );

      const newSetStyle: ITextFunctions = {
        style: {},
        defaults: styleDef,
        type: "color",
        range: range,
        selection: selection,
        childrenArray: childrenArray,
        startIndex: startIndex,
        startElement: startContainer.parentElement!,
        startContainer: startContainer,
        startOffset: findI(ref.current, startContainer, ref.current, range.startOffset, [])!,
        endIndex: endIndex,
        endElement: endContainer.parentElement!,
        endContainer: endContainer,
        endOffset: findI(ref.current, endContainer, ref.current, range.endOffset, [])!
      }
  
      if (e.key === "Enter") {
        e.preventDefault();

        const currentStyle = toStyle(selection.anchorNode?.parentElement?.style)

        const newLine = document.createElement('div')
        const newBlock = document.createElement("span");
        newBlock.innerText = "\n"
        newBlock.setAttribute('style', styleToString(currentStyle)!)

        ref.current?.appendChild(newLine)

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
  const { startIndex, endIndex, childrenArray, style, defaults, startElement, endElement, range, selection } =
    props;

  // Case 1: Style is applied within a single element
  if (startIndex === endIndex) {
    const cArray = Array.from(range.extractContents().children || []) as HTMLElement[];
   let currentStyle = style

   let currentNode = document.createElement('span')
   const newNodes: HTMLSpanElement[] = []

   cArray.forEach((item, index) => {
    const thisStyle = toStyle(item.style)!
    thisStyle[props.type as keyof style] = style[props.type as keyof style]
    
    if(index === 0) {
      if(detectStyleChange(currentStyle, thisStyle, props.type)) currentStyle = thisStyle

      currentNode.setAttribute('style', styleToString(currentStyle)!)
      currentNode.textContent += item.textContent!
    }
    else if(index === cArray.length - 1) {
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

   range.deleteContents();
   newNodes.forEach(item => {
    props.range.insertNode(item)

    range.setStart(item, item.textContent!.length-1);
    range.setEnd(item, item.textContent!.length-1);
    selection.removeAllRanges();
    selection.addRange(range);
  })

    // container.innerHTML = loop(startI, endI, cArray, container, props.range.startOffset, props.startOffset, props.range.endOffset, props.endOffset, toStyle(endElement.style)!)
  }
  else {
  }
}

// function setStyle(props: ITextFunctions) {
//   const { startIndex, endIndex, childrenArray, style, defaults, startElement, endElement } =
//     props;

//   const loop = (startI: number, endI: number, cArray: Element[], container: Element, rso: number, so: number, reo: number, eo: number, endStyle: style, pos?: string): string => {
//     let currentStyle = style
//     let currentHTML = ''

//     for (let index = startI; index <= endI; index++) {
//       const newContainer = cArray[index] as HTMLElement
//       const newStyle = toStyle(newContainer?.style)!
//       newStyle[props.type as keyof style] = style[props.type as keyof style];
//       let resultHtml = '';

//       if (index == startI) {
//         if(detectStyleChange(currentStyle, newStyle, props.type)) currentStyle = newStyle

//         const txtStart = newContainer.textContent!.slice(0, rso);
//         const txtMid = newContainer.textContent!.slice(rso);
//         const startHtml = container.innerHTML!.slice(0, findIndex(container, so)! - txtStart.length);

//         resultHtml = startHtml + txtStart + '</span>' + styleToTag(currentStyle) + txtMid;
//         currentHTML = resultHtml
//       }
//       else if (index == endI) {
//         if(detectStyleChange(currentStyle, newStyle, props.type)){
//           currentStyle = newStyle
//           resultHtml = '</span>' + styleToTag(currentStyle)
//         }

//         const txtStart = newContainer.textContent!.slice(0, reo);
//         const txtEnd = newContainer.textContent!.slice(reo);
//         const endHtml = pos == 'start' ? '</span></div>' : container.innerHTML!.slice(findIndex(container, eo)! + txtEnd.length);
//         resultHtml += txtStart + '</span>' + styleToTag(endStyle) + txtEnd + endHtml;
//         currentHTML += resultHtml
//       }
//       else {
//         if(detectStyleChange(currentStyle, newStyle, props.type)){
//           currentStyle = newStyle
//           resultHtml = '</span>' + styleToTag(currentStyle)
//         }

//         resultHtml += newContainer.textContent;
//         currentHTML += resultHtml
//       }
//     }
//     return currentHTML
//   }

//   // Case 1: Style is applied within a single element
//   if (startIndex === endIndex) {
//     const container = childrenArray[startIndex];
//     const cArray = Array.from(container.children || []);

//     const startI = cArray.findIndex(
//       (child) => child === props.startContainer || child.contains(props.startContainer)
//     );
    
//     const endI = cArray.findIndex(
//       (child) => child === props.endContainer || child.contains(props.endContainer)
//     );

//     container.innerHTML = loop(startI, endI, cArray, container, props.range.startOffset, props.startOffset, props.range.endOffset, props.endOffset, toStyle(endElement.style)!)
//   }
//   else {
//     // Case 2: Style spans across multiple elements
//     for (let index = startIndex; index <= endIndex; index++) {
//       const container = childrenArray[index];
//       const cArray = Array.from(container.children || []);
//       let resultHtml = '';

//       const startI = cArray.findIndex(
//         (child) => child === props.startContainer || child.contains(props.startContainer)
//       );
      
//       const endI = cArray.findIndex(
//         (child) => child === props.endContainer || child.contains(props.endContainer)
//       );

//       if (index === startIndex) {
//         resultHtml = loop(startI, cArray.length - 1, cArray, container, props.range.startOffset, props.startOffset, cArray.length, container.textContent!.length, style, 'start');
//       } else if (index === endIndex) {
//         resultHtml = loop(0, endI, cArray, container, 0, 0, props.range.endOffset, props.endOffset, toStyle(endElement.style)!);
//       } else {
//         resultHtml = loop(0, cArray.length - 1, cArray, container, 0, 0, cArray.length, container.textContent!.length, style, 'start');
//       }
      
//       console.log(resultHtml)
//       container.innerHTML = resultHtml
//     }
//   }
// }

function count(history: number[], container: Node): number {
  let totalCount = 0;

  function traverse(node: Node, depth: number): void {
    if (depth >= history.length) {
      return;
    }

    const index = history[depth];
    const childNodes = Array.from(node.childNodes);

    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];

      if (i < index){
        totalCount += child.textContent?.length || 0
      }
      else if (i === index) {
        traverse(child, depth + 1);
      }
    }
  }

  traverse(container, 0);
  return totalCount;
}

const findI = (pArray: Node, node: Node, parent: Node, pos: number, history?: number[]): number | null => {
  const cArray = Array.from(pArray.childNodes || []);
  let cnt: number | null = null;

  for (let i = 0; i < cArray.length; i++) {
    const cNode = cArray[i];

    if (cNode === node) {
      history?.push(i);

      if (history) {
        if (history.length >= 1 && history[1] > 0) {
          const h = history.slice(1);
          cnt = count(h, parent.childNodes[history[0]]) + pos;

          return cnt;
        }
        else{
          return pos
        }
      }

      return i;
    }
    if (cNode.contains(node)) {
      history?.push(i);
      const childIndex = findI(cNode, node, parent, pos, history);

      if (childIndex !== null && childIndex > 0) {
        return childIndex; // Updated to return the correct childIndex instead of "i"
      }
    }
  }

  return cnt ? cnt : null;
};

function findIndex(
  element: Element,
  textContentIndex: number
): number | null {
  const textContent = element.textContent;
  const innerHTML = element.innerHTML;

  if (!textContent || textContentIndex < 0 || textContentIndex >= textContent.length) {
    return null; // Invalid input or out of bounds
  }

  let textIndex = 0; // Index for textContent traversal
  let htmlIndex = 0; // Index for innerHTML traversal

  // Traverse innerHTML while matching textContent
  while (htmlIndex < innerHTML.length) {
    const htmlChar = innerHTML[htmlIndex];

    // If the current HTML character is part of the visible text
    if (htmlChar === textContent[textIndex]) {
      if (textIndex === textContentIndex) {
        return htmlIndex; // Found the corresponding index
      }
      textIndex++;
    }

    htmlIndex++;
  }

  return null; // Not found
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