"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Badge, Button, Input, Modal } from "@/components/ui";
import {
  Users,
  Search,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  Mail,
  ShoppingBag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isBlocked: boolean;
  blockedReason?: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  // Block modal state
  const [blockModal, setBlockModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [blockReason, setBlockReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        filter,
        page: page.toString(),
      });

      const response = await fetch(`/api/admin/customers?${params}`);
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleBlock = async () => {
    if (!selectedCustomer) return;
    setIsProcessing(true);

    try {
      const response = await fetch(
        `/api/admin/customers/${selectedCustomer._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isBlocked: !selectedCustomer.isBlocked,
            blockedReason: !selectedCustomer.isBlocked ? blockReason : "",
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchCustomers();
        setBlockModal(false);
        setBlockReason("");
        setSelectedCustomer(null);
      } else {
        toast.error(data.error || "Failed to update customer");
      }
    } catch (error) {
      toast.error("Failed to update customer");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    setIsProcessing(true);

    try {
      const response = await fetch(
        `/api/admin/customers/${selectedCustomer._id}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Customer deleted successfully");
        fetchCustomers();
        setDeleteModal(false);
        setSelectedCustomer(null);
      } else {
        toast.error(data.error || "Failed to delete customer");
      }
    } catch (error) {
      toast.error("Failed to delete customer");
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = {
    total: pagination.total,
    active: customers.filter((c) => !c.isBlocked).length,
    blocked: customers.filter((c) => c.isBlocked).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-2">
            {["all", "active", "blocked"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className={`hover:bg-gray-50 ${
                      customer.isBlocked ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-primary-600 font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.name}
                          </p>
                          {customer.isBlocked && customer.blockedReason && (
                            <p className="text-xs text-red-600 mt-0.5">
                              Reason: {customer.blockedReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <p className="text-sm text-gray-500 mt-1">
                            {customer.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">
                        ₹{customer.totalSpent.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={customer.isBlocked ? "danger" : "success"}
                      >
                        {customer.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setBlockModal(true);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            customer.isBlocked
                              ? "hover:bg-green-50 text-green-600"
                              : "hover:bg-red-50 text-red-600"
                          }`}
                          title={
                            customer.isBlocked
                              ? "Unblock customer"
                              : "Block customer"
                          }
                        >
                          {customer.isBlocked ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setDeleteModal(true);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/customers/${customer._id}`}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete customer"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page {page} of {pagination.pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.pages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Block/Unblock Modal */}
      <Modal
        isOpen={blockModal}
        onClose={() => {
          setBlockModal(false);
          setBlockReason("");
          setSelectedCustomer(null);
        }}
        title={
          selectedCustomer?.isBlocked ? "Unblock Customer" : "Block Customer"
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-bold text-lg">
                {selectedCustomer?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {selectedCustomer?.name}
              </p>
              <p className="text-sm text-gray-600">{selectedCustomer?.email}</p>
            </div>
          </div>

          {selectedCustomer?.isBlocked ? (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                Are you sure you want to <strong>unblock</strong> this customer?
                They will be able to sign in and place orders again.
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-red-50 rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-red-800">
                  Blocking this customer will prevent them from signing in or
                  placing orders.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for blocking (optional)
                </label>
                <textarea
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Fraudulent activity, spam orders..."
                />
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button
              fullWidth
              onClick={handleBlock}
              isLoading={isProcessing}
              variant={selectedCustomer?.isBlocked ? "primary" : "primary"}
              className={
                selectedCustomer?.isBlocked ? "" : "bg-red-500 hover:bg-red-600"
              }
            >
              {selectedCustomer?.isBlocked
                ? "Unblock Customer"
                : "Block Customer"}
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setBlockModal(false);
                setBlockReason("");
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setSelectedCustomer(null);
        }}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">
                This action cannot be undone!
              </p>
              <p className="text-red-700 text-sm mt-1">
                Deleting <strong>{selectedCustomer?.name}</strong> will
                permanently remove their account and all associated data.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              fullWidth
              onClick={handleDelete}
              isLoading={isProcessing}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Customer
            </Button>
            <Button
              fullWidth
              variant="outline"
              onClick={() => {
                setDeleteModal(false);
                setSelectedCustomer(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
