import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { dateUtil, timeRanges, TimeRange, isDigitsOnly } from "../../utils";

import { customerService } from "../../services/customerService";
import { orderService } from "../../services/orderService";
import { productService } from "../../services/productService";

import { useToastContext } from "../../stores/ToastContext";

import Icon, { ICONS } from "../../components/UI/Icons/Icon";
import SpeechTextarea from "../../components/UI/SpeechTextarea/SpeechTextarea";

import ManageOrderItems from "../../components/Orders/OrderManager/ManageOrderItems/ManageOrderItems";
import ActionsContainer from "../../components/UI/Actions/ActionsContainer";

import { CreateOrder, OrderDto, OrderItemDto, ProductType } from "../../types";
import styles from "./Order.module.css";
import OrderItemBaseInputData from "../../components/Orders/OrderItemBaseInputData";

export interface AddressData {
  id?: string;
  userId?: string;
  userFullName: string;
  phoneNumber: string;
  displayAddress: string;
}

export default function Order() {
  const today = dateUtil.getCurrentDateFormatted();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const addressId = searchParams.get("addressId");
  const { toastSuccess, toastError } = useToastContext();

  const [addressData, setAddressData] = useState<AddressData>({
    id: undefined,
    userFullName: "",
    phoneNumber: "",
    displayAddress: "",
  });

  const [pickupDate, setPickupDate] = useState<string>(today);
  const [pickupTimeRange, setPickupTimeRange] = useState<TimeRange>(
    timeRanges[0]
  );

  const defaultExpectedCount = 1;
  const [expectedCount, setExpectedCount] =
    useState<number>(defaultExpectedCount);
  const [orderItems, setOrderItems] = useState<Partial<OrderItemDto>[]>([]);
  const [orderNote, setOrderNote] = useState<string>("");
  const [isExpress, setIsExpress] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => navigate(-1);

  const handleAddOrderItem = (item: Partial<OrderItemDto>) => {
    setOrderItems((prev) => {
      const updateExpectedCount =
        prev.length > expectedCount - defaultExpectedCount;

      if (updateExpectedCount) {
        setExpectedCount((prevCount) => prevCount + 1);
      }

      return [...prev, item];
    });
  };

  const handleDeleteItem = (itemId: string) => {
    const isIndex = isDigitsOnly(itemId);
    const targetId = isIndex ? Number(itemId) : itemId;
    setOrderItems((prev) =>
      prev.filter((item, i) =>
        isIndex ? i !== targetId : item.id !== targetId
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productList: ProductType[] | null = await productService.getAll();
        if (productList?.length) {
          setProducts(productList ?? []);
        }

        if (id) {
          const order: OrderDto | null = await orderService.getById(id);
          if (!order) return;

          setAddressData({
            id: order.pickupAddressId,
            userFullName: order.customerFullName,
            phoneNumber: order.phoneNumber,
            displayAddress: order.pickupAddress,
          });

          setPickupDate(dateUtil.format(order.pickupDate));
          setPickupTimeRange(order.pickupTimeRange as TimeRange);
          setOrderItems(order.orderItems);
          setOrderNote(order.note ?? "");
          return;
        }

        if (addressId) {
          const address = await customerService.getById(addressId);
          if (address) setAddressData(address);
        }
      } catch {
        toastError("Грешка при зареждане на данните.");
      }
    };

    fetchData();
  }, [id, addressId, toastError]);

  const isSubmitDisabled = orderItems.length === 0 || expectedCount <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    try {
      const payload: CreateOrder = {
        customerId: addressData.userId,
        pickupAddressId: addressData.id!,
        pickupDate: dateUtil.format(pickupDate, "YYYY-MM-DD"),
        pickupTimeRange,
        expectedCount: Number(expectedCount),
        orderItems,
        note: orderNote?.trim(),
        isExpress,
      };

      if (!id) {
        await orderService.create(payload);
      } else {
        //await orderService.update(id, payload);
      }

      toastSuccess("Поръчката е запазена.");
      navigate("/orders");
    } catch {
      toastError("Грешка при запазване.");
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton}>
        ← Назад
      </button>

      <h2 className={styles.heading}>Създай поръчка</h2>

      <form onSubmit={handleSubmit}>
        <label className={styles.checkboxLabel} htmlFor="isExpress">
          <input
            id="isExpress"
            name=""
            type="checkbox"
            checked={isExpress}
            onChange={(e) => setIsExpress(e.target.checked)}
          />
          Експресна поръчка
        </label>

        <label className={styles.label} htmlFor="customerName">
          Име на клиента
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={addressData.userFullName}
            disabled
          />
        </label>

        <label className={styles.label} htmlFor="phoneNumber">
          Телефон
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            value={addressData.phoneNumber}
            disabled
          />
        </label>

        <label className={styles.label} htmlFor="pickupAddress">
          Адрес за взимане
          <input
            id="pickupAddress"
            name="pickupAddress"
            type="text"
            value={addressData.displayAddress}
            disabled
          />
        </label>

        <div className={styles.row}>
          <label
            htmlFor="pickupDate"
            className={styles.label}
            style={{ width: "30%" }}
          >
            Дата на взимане
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              value={pickupDate}
              min={today}
              onChange={(e) => setPickupDate(e.target.value)}
            />
          </label>

          <label
            htmlFor="pickupTimeRange"
            className={styles.label}
            style={{ width: "40%" }}
          >
            Часови диапазон
            <select
              id="pickupTimeRange"
              name="pickupTimeRange"
              value={pickupTimeRange}
              onChange={(e) => setPickupTimeRange(e.target.value as TimeRange)}
            >
              {timeRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>

          <label
            htmlFor="count"
            className={styles.label}
            style={{ width: "30%" }}
          >
            Брой артикули
            <input
              id="count"
              name="count"
              type="number"
              min={1}
              value={expectedCount}
              onChange={(e) => setExpectedCount(Number(e.target.value))}
              disabled={orderItems.length > 0}
            />
          </label>
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Добавени услуги</legend>

          <ActionsContainer className={styles.logisticActionsContainer}>
            <button type="button" onClick={() => setIsModalOpen(true)}>
              <Icon name={ICONS.add} color="#2563eb" /> Добави услуга
            </button>
          </ActionsContainer>

          <ManageOrderItems
            isExpress={isExpress}
            orderItems={orderItems}
            products={products}
            onEdit={() => {}}
            onDelete={handleDeleteItem}
          />
        </fieldset>

        <SpeechTextarea
          id="order-note"
          value={orderNote}
          onChange={setOrderNote}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitDisabled}
        >
          Save
        </button>
      </form>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <OrderItemBaseInputData
              title="Добави услуга"
              orderItem={undefined}
              products={products}
              isExpress={isExpress}
              onAdd={(item: Partial<OrderItemDto>) => {
                handleAddOrderItem(item);
                setIsModalOpen(false);
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
