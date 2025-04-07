// src/components/App.js
import React from "react";
import {
  EventsProvider,
  useEvents,
  useGlobalEventHandlers,
  eventDefinitions,
} from '@/context/EventsContext";

const App = () => {
  return (
    <EventsProvider>
      <Home />
    </EventsProvider>
  );
};

const Home = () => {
  const { state, onResize } = useEvents();

  // Example handlers for our global events
  useGlobalEventHandlers(
    // Scroll To Function
    (goto, offset) => console.log(`Scrolling to ${goto} with offset ${offset}`),
    {
      startScroll: () => console.log("Start Scrolling!"),
      stopScroll: () => console.log("Stop Scrolling!"),
      nextPrj: (data) => console.log("Load Next Project:", data),
      anim: (data) => console.log(`Animating to state: ${data.state}`, data),
    }
  );

  return (
    <div>
      <h1>Welcome to the App</h1>
      <button onClick={() => onResize()}>Test Resize</button>
      <p>Screen Width: {state.screenWidth}</p>
      <p>Screen Height: {state.screenHeight}</p>
      <p>Is Touch: {state.isTouch ? "Yes" : "No"}</p>
      <button
        onClick={() =>
          document.dispatchEvent(eventDefinitions.nextPrj)
        }
      >
        Trigger "Next Project" Event
      </button>
    </div>
  );
};

export default App;