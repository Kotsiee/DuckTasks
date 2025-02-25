import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.js";
import { useEffect, useState } from "preact/hooks";

export default function Test () {
  const test = useSignal('brooo')

  return(
    <div>
      <h3>{test}</h3>
    </div>
  )
}