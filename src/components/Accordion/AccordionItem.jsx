import { createContext, use } from "react";
const AccordionItemContext = createContext();

export function useAccordionItemContext() {
  const ctx = use(AccordionItemContext);
  if (!ctx) {
    throw new Error(
      "useAccordionItemContext must be used within an <Accordion.Item></Accordion.Item>"
    );
  }
  return ctx;
}

export default function AccordionItem({
  id,
  children,
  className = "",
  ...props
}) {
  return (
    <AccordionItemContext.Provider value={id}>
      <div className={`accordion-item ${className}`} {...props} id={id}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}
