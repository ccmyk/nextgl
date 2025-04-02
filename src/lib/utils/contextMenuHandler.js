// src/lib/utils/contextMenuHandler.js
export function contextMenuHandler(event) {
  event.preventDefault();
  console.log("Right-click at:", event.clientX, event.clientY);
}