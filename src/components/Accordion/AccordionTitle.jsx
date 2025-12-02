import { useAccordionContext } from "./Accordion";
import { useAccordionItemContext } from "./AccordionItem";

export default function AccordionTitle({ children, className = "", ...props }) {
  const { toggleItem } = useAccordionContext();
  const id = useAccordionItemContext();

  return (
    <div className={className} onClick={() => toggleItem(id)} {...props}>
      {children}
    </div>
  );
}
