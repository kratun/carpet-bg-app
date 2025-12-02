import styles from "./Pagination.module.css"; // or .scss, depending on your setup

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Назад
      </button>
      <span>
        Страница {currentPage} от {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Напред
      </button>
    </div>
  );
}
