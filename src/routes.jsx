import { lazy, Suspense } from "react";
import Loading from "./components/UI/Loading";

const Customers = lazy(() => import("./pages/Customers/Customers"));

const OrdersLayout = lazy(() => import("./components/Orders/OrdersLayout"));
const Order = lazy(() => import("./pages/Order/Order"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const LogisticOrdersStep = lazy(() =>
  import("./pages/LogisticOrders/LogisticOrders")
);
const ArrangePickupStep = lazy(() =>
  import("./components/Orders/OrderManager/ArrangePickupStep/ArrangePickupStep")
);

const WashingInProgressStep = lazy(() =>
  import("./pages/WashingInProgressStep/WashingInProgressStep")
);

const SetupLogisticDataStep = lazy(() =>
  import("./pages/SetupLogistic/SetupLogisticData")
);

const NotFound = lazy(() => import("./components/NotFound"));

export const routesConfig = [
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Customers />
      </Suspense>
    ),
  },
  {
    path: "/orders",
    element: (
      <Suspense fallback={<Loading />}>
        <OrdersLayout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <Orders />
          </Suspense>
        ),
      },
      {
        path: "create",
        element: (
          <Suspense fallback={<Loading />}>
            <Order />
          </Suspense>
        ),
      },
      {
        path: "steps/arrange-pickup",
        element: (
          <Suspense fallback={<Loading />}>
            <ArrangePickupStep />
          </Suspense>
        ),
      },
      {
        path: "steps/logistic",
        element: (
          <Suspense fallback={<Loading />}>
            <LogisticOrdersStep />
          </Suspense>
        ),
      },
      {
        path: "steps/setup-logistic-data",
        element: (
          <Suspense fallback={<Loading />}>
            <SetupLogisticDataStep />
          </Suspense>
        ),
      },
      {
        path: "steps/process-washing",
        element: (
          <Suspense fallback={<Loading />}>
            <WashingInProgressStep />
          </Suspense>
        ),
      },
      {
        path: ":id",
        element: (
          <Suspense fallback={<Loading />}>
            <Order />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<Loading />}>
        <NotFound />
      </Suspense>
    ),
  },
];
