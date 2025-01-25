import {
  Signal,
  useSignal,
} from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { JSX } from "preact/jsx-runtime";
import { MutableRef, useEffect } from "preact/hooks";

interface ITextbox {
  text: Signal<string>;
  highlightedText: Signal<Selection | null>;
  rich?: boolean;
  onSubmit?: (text: Signal<string>) => void;
}

export default function Textbox(
    props: JSX.HTMLAttributes<HTMLDivElement> & ITextbox,
    ) {
    const inputRef: MutableRef<HTMLDivElement> | Signal<null> =
        props.ref as MutableRef<HTMLDivElement> || useSignal(null);

    const reset = useSignal<boolean>(false)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.textContent = props.text.value;
        }
    }, [inputRef, props.text.value == '']);

    return (
        <div class={`textbox ${props.class}`} style={{ position: "relative" }}>
        <style>
            {`
                    .input::after {
                        content: '${props.placeholder}';
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: inherit;
                        padding: inherit;
                        margin: inherit;
                        display: ${props.text.value ? "none" : "block"};
                        pointer-events: none;
                        opacity: 0.6;
                    }
                `}
        </style>
        <div
            ref={inputRef}
            class="input"
            contentEditable={true}
            tabindex={0}
            style={{
                border: 'none',
                outline: 'none'
            }}

            onInput={(e) => {
                props.text.value = e.currentTarget.textContent || "";
                props.onInput?.(e);

                if (props.text.value == ''){
                    reset.value = !reset.value
                }
            }}

            onKeyDown={(e) => {
            if (e.key === "Enter") {
                if (e.shiftKey) {
                    e.preventDefault(); // Prevent the default `Shift + Enter` behavior
                    const selection = globalThis.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);

                        // Create a new block element (e.g., <div>)
                        const newBlock = document.createElement("div");
                        newBlock.innerText = "\n"; // Ensure it's ready for typing

                        // Insert the block at the caret position
                        range.deleteContents(); // Remove current selection (if any)
                        range.insertNode(newBlock);

                        // Move the caret into the new block
                        range.setStart(newBlock, 0);
                        range.setEnd(newBlock, 0);
                        selection.removeAllRanges();
                        selection.addRange(range);

                        const inputEvent = new Event("input", { bubbles: true });
                        e.currentTarget.dispatchEvent(inputEvent);
                    }
                } else {
                    props.rich ?? e.preventDefault();
                }
            }
            }}

            onKeyUp={(e) => {
                if (e.key === "Enter" && !e.shiftKey && props.text.value) {
                    props.onSubmit?.(props.text);
                }
            }}

            onPaste={(e) => {
            e.preventDefault();
            const plainText = e.clipboardData?.getData("text/plain") || "";
            document.execCommand("insertText", false, plainText);
            }}

            onMouseUp={() => {
            const selection = globalThis.getSelection();

            if (selection && selection.rangeCount > 0) {
                props.highlightedText.value = selection;
            }
            }}
        >
        </div>
        </div>
    );
    }
