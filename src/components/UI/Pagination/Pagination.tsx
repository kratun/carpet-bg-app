import styles from "./Pagination.module.css"; // or .scss, depending on your setup

export interface PaginationProps {
  currentPageIndex: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPageIndex,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (currentPageIndex < 0) {
    return;
  }

  const isFirstPage = !currentPageIndex;
  const isLastPage = !(currentPageIndex < totalPages);

  const handleNextPage = (isNext: boolean) => {
    if (isNext && !isLastPage) {
      onPageChange(currentPageIndex + 1);
    }

    if (!isNext && !isFirstPage) {
      onPageChange(currentPageIndex - 1);
    }
  };

  const currentPage = currentPageIndex + 1;
  return (
    currentPage && (
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
    )
  );
}
