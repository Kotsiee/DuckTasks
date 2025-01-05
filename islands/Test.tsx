import { PageProps } from "$fresh/server.ts";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useRef } from 'preact/hooks';

export default function Test() {
  const s = useSignal("")

  return (
    <div>
      <textarea id="story" name="story" style={{backgroundColor: "black", width: "600px", height: "400px"}}
      onInput={t => { s.value = t.currentTarget.value! }}>
        {s.value}
      </textarea>

      <p>text-{s.value}</p>
    </div>
  );
}