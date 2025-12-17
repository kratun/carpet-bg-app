import styles from "./Pagination.module.css"; // or .scss, depending on your setup

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const isFirstPage = !(currentPage > 1);
  const isLastPage = !(currentPage < totalPages);

  const handleNextPage = (isNext) => {
    if (isNext && !isLastPage) {
      onPageChange(currentPage + 1);
    }

    if (!isNext && !isFirstPage) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className={styles.pagination}>
      <button onClick={() => handleNextPage(false)} disabled={isFirstPage}>
        Назад
      </button>
      <span>
        Страница {currentPage} от {totalPages}
      </span>
      <button onClick={() => handleNextPage(true)} disabled={isLastPage}>
        Напред
      </button>
    </div>
  );
}
