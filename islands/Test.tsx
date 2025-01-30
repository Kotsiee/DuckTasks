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
        <div><span style="color: default">12345</span><span style="color: lime">67890</span><span style="color: red">12345</span><span style="color: yellow">67890</span><span style="color: yellow">67890</span><span style="color: yellow">67890</span></div>
        <div><span style="color: default">12345</span><span style="color: lime">67890</span><span style="color: red">12345</span><span style="color: yellow">67890</span></div>
        <div><span style="color: default">123456789</span><span style="color: cyan; font-weight: bold">123456789</span><span style="color: purple">123456789</span></div>
        <div>
          <span style="color: default">hello? </span>
          <span style="color: rebeccapurple">it's me </span>
          <span style="color: default">I was wondering </span>
          <span style="color: green; font-weight: bold;">if after all </span>
          <span style="color: seagreen;">these years </span>
          <span style="color: red">you'd </span>
          <span style="color: red; font-weight: bold;">like to meet </span>
          <span style="color: default">to go over </span>
          <span style="color: orange">everything</span>
        </div>`);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current!.innerHTML = text.value;
  }, []);

  const applyTextStyle = (type: ITextFunctions["type"], value: boolean) => {
    const selection = globalThis.getSelection();
    if (!selection || !ref.current) return;

    const range = selection.getRangeAt(0);
    if (range.cloneContents().textContent?.length === 0)
    {
      const newSpan = document.createElement('span')
      const style: style = toStyle(selection.anchorNode?.parentElement?.style)!
      style[type as keyof style] = value
      newSpan.setAttribute('style', styleToString(style))
      newSpan.textContent = '\ '

      range.insertNode(newSpan)
    }
    else {
      if (range.collapsed) return;
  
      const style: style = {}
      style[type as keyof style] = value
  
      const styleDef: style = {
        color: 'default',
        size: undefined,
        bold: false,
        italic: false,
        underline: false,
        strike: false,
      }
  
      const props: ITextFunctions = {
        style: style,
        defaults: styleDef,
        type: type,
        selection: selection,
        ref: ref.current
      }
  
      setStyle(props)
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (!ref.current) return;
    const selection = globalThis.getSelection();
    if (!selection || selection.rangeCount === 0) return;
  
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    let currentBlock = startContainer as HTMLElement;
  
    // Find the parent div block
    while (currentBlock && currentBlock.tagName !== "DIV") {
      currentBlock = currentBlock.parentElement!;
    }
  
    if (!currentBlock) return;
  
    e.preventDefault();
  
    const spans = Array.from(currentBlock.children) as HTMLSpanElement[];
    const startIndex = spans.findIndex((span) => span.contains(startContainer));
  
    // Detect if at the end of the line
    if (
      startIndex === spans.length - 1 &&
      range.startOffset === spans[startIndex].textContent?.length
    ) {
      const newLine = document.createElement("div");
      const newBlock = document.createElement("span");
      newBlock.innerText = "\u200B"; // Zero-width space to maintain cursor position
  
      const childrenArray = Array.from(ref.current.children || []);
      const index = childrenArray.findIndex(
        (child) => child === range.startContainer || child.contains(range.startContainer)
      );
  
      const currentStyle = toStyle(spans[startIndex].style) || {};
      newBlock.setAttribute("style", styleToString(currentStyle)!);
  
      // Insert new line after the current block
      if (index < childrenArray.length - 1) {
        ref.current.insertBefore(newLine, ref.current.children[index + 1]);
      } else {
        ref.current.appendChild(newLine);
      }
  
      newLine.appendChild(newBlock);
  
      // Move cursor to new line
      range.setStart(newBlock, 0);
      range.setEnd(newBlock, 0);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Split the line at cursor position
      const newContainer = document.createElement("div");
  
      // Get current span and text parts
      const startSpan = spans[startIndex];
      const startText = startSpan.textContent!;
      const startOffset = range.startOffset;
  
      const firstPart = startText.slice(0, startOffset); // Before split
      const secondPart = startText.slice(startOffset); // After split
  
      startSpan.textContent = firstPart; // Keep first part in original span
  
      if (secondPart) {
        const splitSpan = document.createElement("span");
        splitSpan.textContent = secondPart;
        const currentStyle = toStyle(startSpan.style) || {};
        splitSpan.setAttribute("style", styleToString(currentStyle)!);
        newContainer.appendChild(splitSpan);
      }
  
      // Move all spans **after** the split point into the new div
      for (let i = startIndex + 1; i < spans.length; i++) {
        newContainer.appendChild(spans[i]);
      }
  
      // Insert the new div block after current
      currentBlock.after(newContainer);
  
      // Move cursor to new line
      range.setStartBefore(newContainer.childNodes[0]);
      range.setEndBefore(newContainer.childNodes[0]);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const keyUp = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    const selection = globalThis.getSelection();
    const range = selection!.getRangeAt(0);
    const startContainer = range.startContainer;

    let container = startContainer as HTMLElement;
    while (container && container.tagName !== "DIV") {
      container = container.parentElement!;
    }

    const spans = Array.from(container.children) as HTMLSpanElement[];
    const index = spans.findIndex((span) => span.contains(startContainer));

    if (e.key === "Backspace") {
      range.setStart(startContainer, range.startOffset)
      range.setEnd(startContainer, range.startOffset)

      if (spans[index] && spans[index + 1]) {
        if(!detectStyleChange(toStyle(spans[index].style)!, toStyle(spans[index + 1].style)!)) {
          const newNode = document.createElement('span')
          newNode.innerText = (spans[index].textContent || '') + (spans[index + 1].textContent || '')
          newNode.setAttribute('style', styleToString(toStyle(spans[index].style))!)
          container.replaceChild(newNode, spans[index])
          container.removeChild(spans[index + 1])
          
          const childrenArray = Array.from(container.children || []);
          range.selectNodeContents(childrenArray[index]);
          range.setStart(childrenArray[index].childNodes[0], spans[index].textContent!.length)
          range.setEnd(childrenArray[index].childNodes[0], spans[index].textContent!.length)
          range.collapse(false);
        }
      }
    }
  }

  const keyDown = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    const selection = globalThis.getSelection();

    if (selection  && ref.current) {  
      if (e.key === "Enter") {
        handleEnterKey(e);
        return;
      }

      if (e.ctrlKey) {
        let handled = false; // Track if a shortcut was processed
    
        switch (e.code) {
          case "KeyB":
            applyTextStyle("bold", true);
            handled = true;
            break;
          case "KeyI":
            applyTextStyle("italic", true);
            handled = true;
            break;
          case "KeyU":
            applyTextStyle("underline", true);
            handled = true;
            break;
          case "KeyQ":
            applyTextStyle("strike", true);
            handled = true;
            break;
        }
    
        // Only prevent default if a shortcut was processed
        if (handled) {
          e.preventDefault();
        }
        else cleanupEmptyNodes(ref.current)
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
      onKeyDown={(e) => {keyDown(e)}}
      onKeyUp={(e) => {keyUp(e)}}
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
  const { style, type, ref } = props;
  let { selection } = props;

  const childrenArray = Array.from(ref.children || []) as HTMLElement[];

  selection = document.getSelection()!
  const range = selection.getRangeAt(0);

  const { endOffset } = range

  let startIndex = childrenArray.findIndex((child) => child === range.startContainer || child.contains(range.startContainer));
  let endIndex = childrenArray.findIndex((child) => child === range.endContainer || child.contains(range.endContainer));

  let currentStyle = style
  if (toStyle(range.startContainer.parentElement?.style)![type as keyof style] === style[type as keyof style] &&
  toStyle(range.endContainer.parentElement?.style)![type as keyof style] === style[type as keyof style])
    currentStyle[type as keyof style] = props.defaults[type as keyof style]

  let startNode: HTMLElement;
  let endNode: HTMLElement;

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
    let currentNode;
    let newNodes: HTMLSpanElement[] = [];

    if (pArray.length > 0) {
      newNodes = loop(pArray)

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
      currentNode = document.createElement('span')
      currentNode.textContent = extracted.textContent
      const newStyle = toStyle(range.startContainer.parentElement?.style)!
      newStyle[type as keyof style] = currentStyle[type as keyof style]
      currentNode.setAttribute('style', styleToString(newStyle)!)
      range.insertNode(currentNode);
    }

    startNode = currentNode ? currentNode : newNodes[0]
    endNode = currentNode ? currentNode : newNodes[newNodes.length-1]
  }
  else {
    pArray.forEach((container, index) => {
      const childrenArray = Array.from(ref.children || []);
      const cArray = Array.from(container.children || []) as HTMLElement[];
      const newNodes: HTMLSpanElement[] = loop(cArray)
      let currentNode;

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
        currentNode = document.createElement('span')
        currentNode.textContent = container.textContent
        currentNode.setAttribute('style', styleToString(currentStyle)!)
        range.insertNode(currentNode);
      }

      if (index === 0) startNode = currentNode ? currentNode : newNodes[0]
      if (index === pArray.length - 1) endNode = currentNode ? currentNode : newNodes[newNodes.length-1]

      selection.removeAllRanges();
      selection.addRange(range);
    })
  }

  const startArray = Array.from(childrenArray[startIndex].children || []) as HTMLElement[];
  const endArray = Array.from(childrenArray[endIndex].children || []) as HTMLElement[];

  startIndex = startArray.findIndex((child) => child === startNode || child.contains(startNode));
  endIndex = endArray.findIndex((child) => child === endNode || child.contains(endNode));

  range.setStart(startNode!.childNodes[0], 0)
  range.setEnd(endNode!.childNodes[0], endOffset)
  selection.removeAllRanges();
  selection.addRange(range);

  cleanupEmptyNodes(ref)
  cleanup(childrenArray)
}

function cleanup(childrenArray: HTMLElement[]) {
  childrenArray.forEach((child) => {

    const childArray = Array.from(child.children || []) as HTMLElement[];
    let currentChild = childArray[0];

    childArray.forEach((span) => {
      let newNode = span;

      if(!detectStyleChange(toStyle(currentChild.style)!, toStyle(span.style)!) && span != childArray[0]) {
        newNode = document.createElement('span')
        newNode.innerText = (currentChild.textContent || '') + (span.textContent || '') 
        newNode.setAttribute('style', styleToString(toStyle(currentChild.style))!)

        child.replaceChild(newNode, currentChild)
        child.removeChild(span)
      }

      currentChild = newNode
    })
  })
}

function cleanupEmptyNodes(parent: HTMLElement) {
  const children = Array.from(parent.children) as HTMLElement[];

  children.forEach((child) => {
    if (child.tagName === "SPAN" && child.textContent?.trim() === "") {
      child.remove();
    }
    if (child.tagName === "DIV" && child.childNodes.length === 0) {
      child.remove();
    }
  });
}