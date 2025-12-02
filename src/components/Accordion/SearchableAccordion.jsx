import { useState, useEffect } from "react";
import Accordion from "./Accordion"; // your existing Accordion
import styles from "./SearchableAccordion.module.css"; // optional
import Loading from "../UI/Loading";

const ITEMS_PER_PAGE = 5;

export default function SearchableAccordion({
  items,
  loading,
  notFoundMessage,
  itemKeyFn,
  renderTitle,
  renderContent,
  onSearchChange,
  className = "",
}) {
  const [inputValue, setInputValue] = useState("");
  // const [debouncedValue, setDebouncedValue] = useState("");
  // const [page, setPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(inputValue);
      // setDebouncedValue(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, onSearchChange]);

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.input}
        />
      </div>
      {loading && (
        <div className={styles.loading}>
          <Loading />
        </div>
      )}
      {!loading && (
        <div>
          <p>{notFoundMessage}</p>
        </div>
      )}

      <Accordion className={styles.accordion}>
        {!loading &&
          items.length > 0 &&
          items.map((item) => (
            <Accordion.Item
              key={itemKeyFn(item)}
              id={itemKeyFn(item)}
              // className={styles.searchableAccordionItem}
            >
              <Accordion.Title className={styles.searchableAccordionItem}>
                {renderTitle(item)}
              </Accordion.Title>
              <Accordion.Content className={styles.searchableAccordionContent}>
                {renderContent(item)}
              </Accordion.Content>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
}
