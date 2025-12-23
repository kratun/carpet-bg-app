import { CustomerModel } from "../components/Customers/Customer";
import { AddressDto, PaginationType } from "../types";
import { apiFetch } from "./apiClient";

export const customerService = {
  // getAll(params = {}) {
  //   let result = [...customers];

  //   const {
  //     search = "",
  //     sortBy = "phoneNumber",
  //     sortOrder = "asc",
  //     page = 1,
  //     limit = 10,
  //     filters = {},
  //   } = params;

  //   // Search by name or email
  //   if (search.trim()) {
  //     const term = search.trim().toLowerCase();
  //     result = result.filter(
  //       (c) =>
  //         c.phoneNumber.toLowerCase().includes(term) ||
  //         (c.email && c.email.toLowerCase().includes(term))
  //     );
  //   }

  //   // Filters (e.g., can filter by any customer field)
  //   for (const key in filters) {
  //     if (filters[key]) {
  //       result = result.filter((c) =>
  //         String(c[key]).includes(String(filters[key]))
  //       );
  //     }
  //   }

  //   // Sort
  //   result.sort((a, b) => {
  //     const aValue = a[sortBy];
  //     const bValue = b[sortBy];
  //     if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
  //     if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
  //     return 0;
  //   });

  //   // Pagination
  //   const total = result.length;
  //   const start = (page - 1) * limit;
  //   const paginated = result.slice(start, start + limit);

  //   return Promise.resolve({
  //     data: paginated,
  //     total,
  //     page,
  //     limit,
  //   });
  // },

  // update(id: string, updates) {
  //   const index = customers.findIndex((c) => c.id === Number(id));
  //   if (index === -1) return Promise.resolve(null);
  //   customers[index] = { ...customers[index], ...updates };
  //   return Promise.resolve(customers[index]);
  // },

  // delete(id) {
  //   customers = customers.filter((c) => c.id !== Number(id));
  //   return Promise.resolve();
  // },

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
  } = {}): Promise<PaginationType<AddressDto>> {
    const params = {
      searchTerm,
      pageIndex,
      pageSize,
    };

    return apiFetch.get("/addresses", { params });
  },

  async getById(id: string): Promise<AddressDto> {
    return apiFetch.get(`/addresses/${id}`);
  },

  async create(address: CustomerModel): Promise<AddressDto> {
    const body = {
      userFullName: address.userFullName,
      phoneNumber: address.phoneNumber,
      displayAddress: address.displayAddress || undefined,
    };
    return apiFetch.post("/addresses", { body });
  },
};

export default customerService;
