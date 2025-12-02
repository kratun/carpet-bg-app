import { useAccordionContext } from "./Accordion";
import { useAccordionItemContext } from "./AccordionItem";

export default function AccordionContent({ children, className = "" }) {
  const { openItemId } = useAccordionContext();

  const id = useAccordionItemContext();

  const isOpen = openItemId === id;
  // let openStyle;
  // if (isOpen) {
  //   openStyle = {
  //     backgroundColor: "#eef2ff" /* Example active background */,
  //     borderLeft: "3px solid #3b82f6" /* Optional visual indicator */,
  //   };
  // }
  return (
    <div
      className={`${className} ${isOpen ? "open" : "close"}`}
      // style={openStyle}
    >
      {isOpen && children}
    </div>
  );
}
