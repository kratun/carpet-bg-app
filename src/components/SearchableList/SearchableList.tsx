import { useEffect, useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../UI/Loading";
import styles from "./SearchableList.module.css";

/* ================================
   TYPES
================================ */

export interface SearchableListProps<TItem extends { id: string }> {
  items?: TItem[];
  loading?: boolean;
  notFoundMessage?: string;
  className?: string;

  /** Extracts a unique key for each item */
  itemKeyFn: (item: TItem) => string;

  /** Render prop for list item */
  children: (item: TItem) => ReactNode;

  /** Called when action button is clicked */
  onActionClicked?: (value: string) => void;

  /** Field used for filtering (defaults to phoneNumber) */
  searchField?: keyof TItem;
}

/* ================================
   COMPONENT
================================ */

export default function SearchableList<TItem extends { id: string }>({
  items = [],
  loading = false,
  notFoundMessage = "No items found.",
  className = "",
  itemKeyFn,
  children,
  onActionClicked,
  searchField = "phoneNumber" as keyof TItem,
}: SearchableListProps<TItem>) {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  /* ================================
     DEBOUNCE
  ================================ */

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  /* ================================
     FILTER
  ================================ */

  const filteredItems = useMemo(() => {
    if (!debouncedValue) return items;

    return items.filter((item) => {
      const value = item[searchField];
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(debouncedValue.toLowerCase())
      );
    });
  }, [items, debouncedValue, searchField]);

  /* ================================
     RENDER
  ================================ */

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.input}
        />

        {onActionClicked && (
          <button
            className={styles.button}
            onClick={() => onActionClicked(inputValue)}
            type="button"
          >
            + Add customer
          </button>
        )}
      </div>

      {loading && <Loading />}

      {!loading && filteredItems.length === 0 && (
        <p className={styles.notFound}>{notFoundMessage}</p>
      )}

      {!loading && filteredItems.length > 0 && (
        <div className={className}>
          {filteredItems.map((item) => (
            <div
              key={itemKeyFn(item)}
              className={styles.item}
              onClick={() => navigate(`/orders/create?addressId=${item.id}`)}
            >
              {children(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
