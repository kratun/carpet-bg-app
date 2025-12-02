import { createContext, use, useState } from "react";
import AccordionItem from "./AccordionItem";
import AccordionContent from "./AccordionContent";
import AccordionTitle from "./AccordionTitle";

const AccordionContext = createContext();

export function useAccordionContext() {
  const ctx = use(AccordionContext);
  if (!ctx) {
    throw new Error(
      "useAccordionContext must be used within an AccordionProvider"
    );
  }
  return ctx;
}

export default function Accordion({ children, className = "", ...props }) {
  const [openItemId, setOpenItemId] = useState();

  const toggleItem = (id) => {
    setOpenItemId((prevId) => (prevId === id ? null : id));
  };

  const contextValue = {
    openItemId,
    toggleItem,
  };

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={`accordion ${className}`} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

Accordion.Item = AccordionItem;
Accordion.Content = AccordionContent;
Accordion.Title = AccordionTitle;
