import { toChildArray } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { createElement } from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useRef, useEffect } from 'preact/hooks';

export default function Test() {
  const text = useSignal<string>('heyy');
  const ref = useRef<HTMLDivElement>(null);

  const pBlock = (e: createElement.JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    const selection = globalThis.getSelection();
    const childrenArray = Array.from(ref.current?.childNodes || []);

    if (e.key === "Enter" && selection && ref.current) {
      e.preventDefault();
  
      // Save selection
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;
      const startOffset = range.startOffset;
      const endOffset = range.endOffset;
  
      // Traverse the children to find the correct node indices
      let startIndex = childrenArray.findIndex(
        (child) => child === startContainer || child.contains(startContainer)
      );
      let endIndex = childrenArray.findIndex(
        (child) => child === endContainer || child.contains(endContainer)
      );
  
      console.log("Start/End Indices:", startIndex, endIndex);
  
      // Ensure indices are valid
      if (startIndex === -1 || endIndex === -1) return;
  
      for (let i = startIndex; i <= endIndex; i++) {
        const node = ref.current.children[i];
  
        if (!node) continue;
  
        const isStartNode = i === startIndex;
        const isEndNode = i === endIndex;
  
        // Handle nodes that partially overlap the selection
        if (isStartNode || isEndNode) {
          const text = node.textContent || "";
  
          const start = isStartNode ? text.slice(0, startOffset) : "";
          const middle = isStartNode && isEndNode
            ? text.slice(startOffset, endOffset)
            : isStartNode
            ? text.slice(startOffset)
            : text.slice(0, endOffset);
          const end = isEndNode ? text.slice(endOffset) : "";
  
          // Wrap the middle part with a <span>
          const wrapped = `<span>${middle}</span>`;
          node.innerHTML = `${start}${wrapped}${end}`;
        } else {
          // Fully selected nodes are wrapped entirely
          node.innerHTML = `<span>${node.textContent}</span>`;
        }
      }

      const newRange = document.createRange();
      const newStartNode = ref.current.childNodes[startIndex]?.firstChild || ref.current.childNodes[startIndex];
      const newEndNode = ref.current.childNodes[endIndex]?.firstChild || ref.current.childNodes[endIndex];

      newRange.setStart(newStartNode, startOffset);
      newRange.setEnd(newEndNode, endOffset);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // const oldBlock = ref.current.children[startIndex];
      // const newBlock = document.createElement("div");

      // oldBlock.textContent = start || '\n'
      // newBlock.innerText = end || '\n'

      // ref.current.replaceChild(oldBlock, ref.current.children[startIndex])

      // startIndex > childrenArray.length - 1 ?
      // ref.current?.appendChild(newBlock) :
      // ref.current?.insertBefore(newBlock, ref.current.children[startIndex + 1])

      // const newRange = document.createRange();
      // const newStartNode = childrenArray[startIndex]?.firstChild || childrenArray[startIndex];
      // const newEndNode = childrenArray[endIndex]?.firstChild || childrenArray[endIndex];

      // newRange.setStart(newStartNode, minOff);
      // newRange.setEnd(newEndNode, maxOff);
      // selection.removeAllRanges();
      // selection.addRange(newRange);
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
        text.value = e.currentTarget.textContent || "";
      }}
      >
        <div>123</div>
        <div>12345</div>
        <div>1234567</div>
        <div>123456789</div>
      </div>
    </div>
  );
}
