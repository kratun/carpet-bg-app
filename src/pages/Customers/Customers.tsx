import { useEffect, useState, useCallback } from "react";

import customerService from "../../services/customerService";

import SearchableList from "../../components/SearchableList/SearchableList";
import Customer, { CustomerModel } from "../../components/Customers/Customer";
import ModalHeader from "../../components/UI/Modal/ModalHeader";
import Loading from "../../components/UI/Loading";

import styles from "./Customers.module.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);

  const handleCloseModal = () => setIsModalOpen(false);

  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomerAddresses({
        searchTerm,
        pageIndex,
        pageSize,
      });
      setCustomers(res.items);
      setTotalPages(res.totalPages);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error loading addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, pageIndex, pageSize]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddConsumer = async (customerData: CustomerModel) => {
    await customerService.create(customerData);
    fetchAddresses();
    setIsModalOpen(true);
  };

  const handleAddConsumerClicked = (phone: string) => {
    setSearchTerm(phone);
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <SearchableList
        items={customers}
        itemKeyFn={(customer: CustomerModel) => customer.userId}
        onActionClicked={handleAddConsumerClicked}
      >
        {(customer: CustomerModel) => (
          <>
            <p>&rarr;</p>
            <div className={styles.listItem}>
              <p>{customer.phoneNumber}</p>
              <p>{customer.userFullName}</p>
              <p>{customer.displayAddress}</p>
            </div>
          </>
        )}
      </SearchableList>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <Customer
              customerPhone={searchTerm}
              customerName=""
              customerAddress=""
              renderHeader={() => (
                <ModalHeader title="Добави клиент" onClose={handleCloseModal} />
              )}
              onCancel={handleCloseModal}
              onSave={handleAddConsumer}
            />
          </div>
        </div>
      )}
    </div>
  );
}
