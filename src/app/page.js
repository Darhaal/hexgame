// src/app/page.js
"use client";

/**
 * Main page — mounts the HexMap component.
 * Keep this file minimal so App Router can SSR the shell if needed.
 */
import HexMap from "../components/map/HexMap";

export default function Page() {
  return <HexMap />;
}