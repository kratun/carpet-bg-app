import { useEffect, useState, useCallback } from "react";

import customerService from "../../services/customerService";

import SearchableList from "../SearchableList/SearchableList";
import Customer from "./Customer";
import ModalHeader from "./ModalHeader";
import Loading from "../UI/Loading";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(100);
  const [totalPages, setTotalPages] = useState(0);

  const handleCloseModal = () => setIsModalOpen(false);

  // useEffect(() => {
  //   customerService.getAll().then((res) => {
  //     setCustomers(res.data);
  //     setLoading(false);
  //   });
  // }, []);
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomerAddresses({
        searchTerm,
        pageNumber,
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
  }, [searchTerm, pageNumber, pageSize]);
  useEffect(() => {
    // const fetchAddresses = async () => {
    //   setLoading(true);
    //   try {
    //     const res = await customerService.getCustomerAddresses({
    //       searchTerm,
    //       pageNumber,
    //       pageSize,
    //     });
    //     setCustomers(res.items);
    //     setTotalPages(res.totalPages);
    //   } catch (err) {
    //     console.error("Error loading addresses:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    fetchAddresses();
  }, [fetchAddresses]);

  const handleAddConsumer = async (customerData) => {
    console.log("Consumer added!", customerData);
    await customerService.create(customerData);
    fetchAddresses();
    setIsModalOpen(true);
  };

  const handleAddConsumerClicked = (phone) => {
    setSearchTerm(phone);
    setIsModalOpen(true);
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: "#fff",
    borderRadius: 8,
    maxWidth: "90%",
    width: 400,
  };

  const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#333",
    padding: "0",
  };

  const listItemStyle = {
    padding: "8px 16px",
    cursor: "pointer",
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "16px" }}>
      <SearchableList
        items={customers}
        listItemStyle={listItemStyle}
        itemKeyFn={(customer) => customer.id}
        onActionClicked={handleAddConsumerClicked}
      >
        {(customer) => (
          <>
            <p>&rarr;</p>
            <div style={listItemStyle}>
              <p>{customer.phoneNumber}</p>
              <p>{customer.userFullName}</p>
              <p>{customer.displayAddress}</p>
            </div>
          </>
        )}
      </SearchableList>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <Customer
              customerPhone={searchTerm}
              customerName={""}
              customerAddress={""}
              renderHeader={() => (
                <ModalHeader
                  title="Добави клиент"
                  onClose={handleCloseModal}
                  closeButtonStyle={closeButtonStyle}
                />
              )}
              onCancel={handleCloseModal}
              onSave={handleAddConsumer}
            />
            {/* <OrderItemBaseInputData
              phoneNumber={searchTerm}
              renderHeder={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                  }}
                >
                  <p>Добави услуга</p>
                  <button
                    onClick={handleCloseModal}
                    style={closeButtonStyle}
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
              )}
              onAdd={(item) => {
                handleAddConsumer(item);
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            /> */}
          </div>
        </div>
      )}
    </div>
  );
}
