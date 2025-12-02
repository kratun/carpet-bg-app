import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../UI/Loading";

export default function SearchableList({
  items = [],
  loading = false,
  notFoundMessage = "No items found.",
  itemKeyFn,
  className = "",
  children,
  onActionClicked,
}) {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item?.phoneNumber?.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }, [debouncedValue, items]);

  return (
    <div className="searchable-list-container">
      <style>
        {`
          .searchable-list-container {
            width: 100%;
            max-width: 600px;
            margin: auto;
          }

          .search-controls {
            display: flex;
            align-items: center; /* vertically center */
            gap: 8px; /* horizontal space between input and button */
            margin-bottom: 10px;
          }

          .search-input {
            flex: 1; /* fill available space */
            padding: 8px 12px;
            border: 1px solid #2563eb;
            border-radius: 4px;
            font-size: 1rem;
            height: 40px; /* fixed height */
            box-sizing: border-box;
            color: #1e3a8a; /* dark blue */
          }

          .search-input:focus {
            outline: none;
            border: 1px solid #2563eb; /* keep border the same */
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); /* nice focus ring */
          }

          .search-input::placeholder {
            color: #1e3a8a; /* dark blue */
            opacity: 1; /* fully opaque */
          }

          .searchable-list-button {
            height: 40px; /* same height as input */
            padding: 0 16px;
            border: none;
            background-color: #2D7DBF;
            color: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            flex-shrink: 0; /* prevent shrinking */
            transition: background-color 0.3s ease;
          }

          .searchable-list-button:hover {
            background-color: #1e40af;
          }

          .searchable-list-item {
            padding: 8px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .searchable-list-item:hover {
            background-color: #f9f9f9;
          }
        `}
      </style>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="search-input"
        />

        <button
          className="searchable-list-button"
          onClick={() => onActionClicked(inputValue)}
        >
          + Add customer
        </button>
      </div>

      {loading && <Loading />}
      {!loading && items.length === 0 && (
        <div>
          <p>{notFoundMessage}</p>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className={`${className}`}>
          {filteredItems.map((item) => (
            <div
              key={itemKeyFn(item)}
              id={itemKeyFn(item)}
              className="searchable-list-item"
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
