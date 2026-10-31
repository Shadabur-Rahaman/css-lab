import { useEffect, useMemo, useRef, useState } from "react";
import { previewDocument } from "../engine.mjs";
export type Inspection = {
  tag: string;
  classes: string;
  width: number;
  height: number;
  color: string;
  background: string;
  display: string;
  position: string;
  padding: string;
  margin: string;
  boxSizing: string;
};
export default function Preview({
  html,
  css,
  width = 760,
  height = 340,
  selector = "",
  onInspect,
  onMatches,
  onViewport,
}: {
  html: string;
  css: string;
  width?: number;
  height?: number;
  selector?: string;
  onInspect?: (x: Inspection) => void;
  onMatches?: (x: { count?: number; names?: string[]; error?: string }) => void;
  onViewport?: (x: { overflow: boolean; width: number }) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [channel] = useState(() => crypto.randomUUID());
  const src = useMemo(
    () => previewDocument(html, css, channel, selector),
    [html, css, channel, selector],
  );
  useEffect(() => {
    function receive(e: MessageEvent) {
      if (
        e.source !== frame.current?.contentWindow ||
        !e.data ||
        e.data.channel !== channel
      )
        return;
      const d = e.data;
      if (
        d.kind === "inspect" &&
        typeof d.tag === "string" &&
        typeof d.width === "number" &&
        typeof d.color === "string"
      )
        onInspect?.(d);
      if (
        d.kind === "matches" &&
        (typeof d.count === "number" || typeof d.error === "string")
      )
        onMatches?.(d);
      if (
        d.kind === "viewport" &&
        typeof d.overflow === "boolean" &&
        typeof d.width === "number"
      )
        onViewport?.(d);
    }
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [channel, onInspect, onMatches, onViewport]);
  return (
    <div className="preview-scroll">
      <iframe
        ref={frame}
        sandbox="allow-scripts"
        title="Isolated CSS experiment preview"
        srcDoc={src}
        style={{ width, maxWidth: "none", height }}
      />
    </div>
  );
}
