import { apiFetch } from "./apiClient";

let customers = [
  {
    id: 1,
    fullName: "Customer 1",
    phoneNumber: "0889 188 779",
    displayAddress: "Item 1 description",
  },
  {
    id: 2,
    fullName: "Customer 2",
    phoneNumber: "0879 187 782",
    displayAddress: "Item 2 description",
  },
  {
    id: 3,
    fullName: "Customer 3",
    phoneNumber: "0999 651 654",
    displayAddress: "Item 3 description Item 3 description Item 3 description",
  },
  {
    id: 4,
    fullName: "Customer 4",
    phoneNumber: "0999 651 654",
    displayAddress: "Item 4 description",
  },
  {
    id: 5,
    fullName: "Customer 5",
    phoneNumber: "0877 651 654",
    displayAddress: "Item 5 description",
  },
  {
    id: 6,
    fullName: "Customer 6",
    phoneNumber: "0887 351 654",
    displayAddress: "Item 6 description",
  },
  {
    id: 7,
    fullName: "Customer 7",
    phoneNumber: "0989 451 654",
    displayAddress: "Item 7 description",
  },
  {
    id: 8,
    fullName: "Customer 8",
    phoneNumber: "0999 251 624",
    displayAddress: "Item 8 description",
  },
];

export const customerService = {
  create(address) {
    const body = {
      userFullName: address.name,
      phoneNumber: address.phone,
      displayAddress: address.address || undefined,
    };
    return apiFetch.post("/addresses", { body });
  },

  getAll(params = {}) {
    let result = [...customers];

    const {
      search = "",
      sortBy = "phoneNumber",
      sortOrder = "asc",
      page = 1,
      limit = 10,
      filters = {},
    } = params;

    // Search by name or email
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.phoneNumber.toLowerCase().includes(term) ||
          (c.email && c.email.toLowerCase().includes(term))
      );
    }

    // Filters (e.g., can filter by any customer field)
    for (const key in filters) {
      if (filters[key]) {
        result = result.filter((c) =>
          String(c[key]).includes(String(filters[key]))
        );
      }
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = result.length;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return Promise.resolve({
      data: paginated,
      total,
      page,
      limit,
    });
  },

  async getById(id) {
    return apiFetch.get(`/addresses/${id}`);
  },

  update(id, updates) {
    const index = customers.findIndex((c) => c.id === Number(id));
    if (index === -1) return Promise.resolve(null);
    customers[index] = { ...customers[index], ...updates };
    return Promise.resolve(customers[index]);
  },

  delete(id) {
    customers = customers.filter((c) => c.id !== Number(id));
    return Promise.resolve();
  },

  // getCustomerAddresses(searchTerm = "") {
  //   const allAddresses = customers.flatMap((c) => c.addresses || []);
  //   if (!searchTerm.trim()) return Promise.resolve(allAddresses);

  //   const term = searchTerm.trim().toLowerCase();
  //   const filtered = allAddresses.filter((addr) =>
  //     addr.toLowerCase().includes(term)
  //   );

  //   return Promise.resolve(filtered);
  // },

  async getCustomerAddresses({
    searchTerm = "",
    pageIndex = 0,
    pageSize = 10,
  } = {}) {
    const params = {
      searchTerm,
      pageIndex,
      pageSize,
    };

    return apiFetch.get("/addresses", { params });
  },
};

export default customerService;
