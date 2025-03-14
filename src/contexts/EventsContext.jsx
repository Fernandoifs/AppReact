import { createContext, useContext, useState } from 'react';
import eventsData from '../mocks/events.json';

const EventsContext = createContext();

export const EventsProvider = ({ children }) => {
  // Initialize events directly with mock data
  const [events, setEvents] = useState(eventsData.events);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  return (
    <EventsContext.Provider value={{ events, setEvents, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);