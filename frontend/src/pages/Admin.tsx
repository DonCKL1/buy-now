import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiLogOut,
  FiShoppingBag,
  FiCheckCircle,
  FiDollarSign,
  FiLock,
  FiUser,
  FiShield,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiX,
  FiArrowLeft,
  FiCalendar,
  FiPhone,
  FiCreditCard,
  FiTruck,
  FiClock,
  FiCheckSquare,
  FiSquare,
} from 'react-icons/fi';
import Swal from 'sweetalert2';

import {
  adminLogin,
  adminLogout,
  getOrders,
  getStats,
  updateDeliveryStatus,
  deleteOrder,
  exportOrdersCSV,
  Order,
  Stats,
} from '../services/api';

const Admin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');
  const [tableLoading, setTableLoading] = useState(false);

  // Selected Order for viewing in modal card
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Check if already logged in
  useEffect(() => {
    const creds = localStorage.getItem('admin_creds');
    if (creds) {
      setIsLoggedIn(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setTableLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        getOrders(search || undefined, statusFilter || undefined, deliveryFilter || undefined),
        getStats(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem('admin_creds');
        Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Please log in again.',
          confirmButtonColor: '#2563eb',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data from server.',
          confirmButtonColor: '#2563eb',
        });
      }
    } finally {
      setTableLoading(false);
    }
  }, [search, statusFilter, deliveryFilter]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoginLoading(true);
    const success = await adminLogin(username.trim(), password);
    setLoginLoading(false);

    if (success) {
      setIsLoggedIn(true);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setOrders([]);
    setStats(null);
  };

  const handleToggleDelivery = async (orderId: number, currentStatus: 'PENDING' | 'DELIVERED', orderRef?: string) => {
    const newStatus = currentStatus === 'DELIVERED' ? 'PENDING' : 'DELIVERED';
    const actionLabel = newStatus === 'DELIVERED' ? 'Mark as Delivered' : 'Mark as Pending';

    const result = await Swal.fire({
      title: `${actionLabel}?`,
      text: orderRef
        ? `Are you sure you want to update delivery status for ${orderRef} to ${newStatus}?`
        : `Are you sure you want to update delivery status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newStatus === 'DELIVERED' ? '#16a34a' : '#d97706',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${actionLabel}`,
    });

    if (!result.isConfirmed) return;

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, delivery_status: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, delivery_status: newStatus } : null));
    }

    try {
      const success = await updateDeliveryStatus(orderId, newStatus);
      if (success) {
        Swal.fire({
          icon: 'success',
          title: newStatus === 'DELIVERED' ? 'Marked as Delivered' : 'Marked as Pending',
          text: `Order status updated to ${newStatus}.`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
        });
        // Refresh stats
        const freshStats = await getStats();
        setStats(freshStats);
      }
    } catch {
      // Revert on failure
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, delivery_status: currentStatus } : ord))
      );
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update delivery status.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleDeleteOrder = async (id: number, ref: string) => {
    const result = await Swal.fire({
      title: 'Delete Order?',
      text: `Are you sure you want to delete order ${ref}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Order',
    });

    if (result.isConfirmed) {
      try {
        const deleted = await deleteOrder(id);
        if (deleted) {
          if (selectedOrder?.id === id) {
            setSelectedOrder(null);
          }
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Order deleted successfully.',
            timer: 1500,
            showConfirmButton: false,
          });
          fetchData();
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete order.',
          confirmButtonColor: '#2563eb',
        });
      }
    }
  };

  const handleExport = async () => {
    try {
      await exportOrdersCSV(statusFilter || undefined, deliveryFilter || undefined);
      Swal.fire({
        icon: 'success',
        title: 'Export Complete',
        text: 'Orders CSV has been downloaded.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Export Failed',
        text: 'Failed to export orders.',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `GHS ${Number(amount).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
  };

  const formatSizePayload = (sizeStr: string) => {
    if (!sizeStr || !sizeStr.startsWith('{')) return sizeStr;
    try {
      const data = JSON.parse(sizeStr);
      const parts = [];
      if (data.classicTshirt?.qty > 0) {
        const sizes = (data.classicTshirt.sizes || []).filter(Boolean).join(', ');
        parts.push(`${data.classicTshirt.qty}x Classic ${sizes ? `(${sizes})` : ''}`);
      }
      if (data.limitedTshirt?.qty > 0) {
        const sizes = (data.limitedTshirt.sizes || []).filter(Boolean).join(', ');
        parts.push(`${data.limitedTshirt.qty}x Ltd Edition ${sizes ? `(${sizes})` : ''}`);
      }
      if (data.mug?.qty > 0) {
        parts.push(`${data.mug.qty}x Mug`);
      }
      if (data.bag?.qty > 0) {
        parts.push(`${data.bag.qty}x Tote Bag`);
      }
      return parts.join(' | ') || sizeStr;
    } catch (e) {
      return sizeStr;
    }
  };

  // ──── Login Screen ────
  if (!isLoggedIn) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <FiShield size={28} color="white" />
            </div>
            <h2 className="admin-login-title">Admin Portal</h2>
            <p className="admin-login-subtitle">Sign in to manage orders & sales</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-username" className="form-label">Username</label>
              <div className="input-with-icon">
                <FiUser className="field-icon" />
                <input
                  id="admin-username"
                  type="text"
                  className="form-input"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div className="input-with-icon">
                <FiLock className="field-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={loginLoading}
              id="admin-login-btn"
            >
              {loginLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                'SIGN IN TO DASHBOARD'
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/" className="hero-secondary-btn-dark" style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'center', width: '100%' }}>
              <FiArrowLeft /> Return to T-Shirt Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──── Admin Dashboard ────
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      {/* Top Professional White Header matching Store Header */}
      <header className="site-header-white">
        <div className="header-container">
          <Link to="/" className="brand-logo-link">
            <div className="brand-badge-wrapper">
              <img
                src="/logo.png"
                alt="CKL TECH Logo"
                className="brand-logo-img"
              />
            </div>
            <div className="brand-text">
              <h1 className="brand-title-dark">CKL TECH</h1>
              <p className="brand-subtitle-dark" style={{ color: '#2563eb' }}>
                <FiShield className="inline-icon" style={{ marginRight: 3 }} />
                ADMIN CONTROL CENTER
              </p>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/" className="hero-secondary-btn-dark" style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}>
              <FiArrowLeft /> Store
            </Link>
            <button className="toolbar-btn" onClick={handleLogout} id="admin-logout-btn" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.45rem 0.85rem' }}>
              <FiLogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-wide page-enter" style={{ padding: '1.5rem 1rem' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>T-Shirt Orders & Delivery Management</h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>Track sales, verify payments, and mark orders as delivered.</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-label">
                <FiShoppingBag size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Total Orders
              </div>
              <div className="stat-value">{stats.totalOrders}</div>
            </div>
            <div className="stat-card success">
              <div className="stat-label">
                <FiCheckCircle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Paid Orders
              </div>
              <div className="stat-value">{stats.paidOrders}</div>
            </div>
            <div className="stat-card accent">
              <div className="stat-label">
                <FiTruck size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Delivered
              </div>
              <div className="stat-value" style={{ color: '#16a34a' }}>{stats.deliveredOrders}</div>
            </div>
            <div className="stat-card" style={{ borderColor: '#fde68a', background: '#fffbeb' }}>
              <div className="stat-label" style={{ color: '#b45309' }}>
                <FiClock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Pending Delivery
              </div>
              <div className="stat-value" style={{ color: '#d97706' }}>{stats.pendingDeliveries}</div>
            </div>
            <div className="stat-card primary" style={{ gridColumn: 'span 1' }}>
              <div className="stat-label">
                <FiDollarSign size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Total Revenue
              </div>
              <div className="stat-value" style={{ fontSize: '1.3rem' }}>{formatCurrency(stats.totalSales)}</div>
            </div>
          </div>
        )}

        {/* Search & Action Toolbar */}
        <form className="admin-toolbar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search student name, ID, order ref, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="admin-search"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            id="admin-status-filter"
          >
            <option value="">All Payments</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
          <select
            value={deliveryFilter}
            onChange={(e) => setDeliveryFilter(e.target.value)}
            id="admin-delivery-filter"
          >
            <option value="">All Deliveries</option>
            <option value="DELIVERED">Delivered Only</option>
            <option value="PENDING">Pending Delivery Only</option>
          </select>
          <button type="submit" className="toolbar-btn" id="admin-search-btn">
            <FiSearch size={16} />
            Search
          </button>
          <button type="button" className="toolbar-btn" onClick={fetchData} id="admin-refresh-btn">
            <FiRefreshCw size={16} />
            Refresh
          </button>
          <button type="button" className="toolbar-btn export" onClick={handleExport} id="admin-export-btn">
            <FiDownload size={16} />
            Export CSV
          </button>
        </form>

        {/* Desktop View: Orders Table */}
        <div className="orders-table-wrapper desktop-only">
          {tableLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="spinner" style={{ margin: '0 auto', borderColor: 'rgba(37,99,235,0.2)', borderTopColor: '#2563eb' }}></div>
              <p style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <FiShoppingBag size={44} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600 }}>No orders match your criteria</p>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Delivered</th>
                  <th>Order Ref</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Phone</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ background: order.delivery_status === 'DELIVERED' ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        className={`delivery-toggle-btn ${order.delivery_status === 'DELIVERED' ? 'delivered' : 'pending'}`}
                        onClick={() => handleToggleDelivery(order.id, order.delivery_status, order.order_reference)}
                        title={order.delivery_status === 'DELIVERED' ? 'Mark as Pending' : 'Mark as Delivered'}
                      >
                        {order.delivery_status === 'DELIVERED' ? (
                          <>
                            <FiCheckSquare size={17} color="#16a34a" />
                            <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '0.75rem' }}>DELIVERED</span>
                          </>
                        ) : (
                          <>
                            <FiSquare size={17} color="#d97706" />
                            <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.75rem' }}>PENDING</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {order.order_reference}
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{order.name}</td>
                    <td style={{ color: '#475569', fontWeight: 500 }}>{order.index_number}</td>
                    <td>
                      <a href={`tel:${order.phone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                        {order.phone}
                      </a>
                    </td>
                    <td style={{ fontWeight: 800 }}>{formatSizePayload(order.size)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 700 }}>{order.quantity}</td>
                    <td style={{ fontWeight: 800, color: '#2563eb' }}>{formatCurrency(order.amount)}</td>
                    <td>
                      <span className={`status-badge ${order.payment_status.toLowerCase()}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{formatDate(order.created_at)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="action-icon-btn view"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <FiEye size={15} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete"
                          onClick={() => handleDeleteOrder(order.id, order.order_reference)}
                          title="Delete Order"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile View: High-Touch Mobile Order Cards */}
        <div className="mobile-orders-list mobile-only">
          {tableLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="spinner" style={{ margin: '0 auto', borderColor: 'rgba(37,99,235,0.2)', borderTopColor: '#2563eb' }}></div>
              <p style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
              <FiShoppingBag size={36} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No orders found</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="admin-mobile-card"
                style={{
                  borderColor: order.delivery_status === 'DELIVERED' ? '#bbf7d0' : '#e2e8f0',
                  background: order.delivery_status === 'DELIVERED' ? '#f0fdf4' : 'white',
                }}
              >
                <div className="mobile-card-header">
                  <span className="mobile-card-ref">{order.order_reference}</span>
                  <span className={`status-badge ${order.payment_status.toLowerCase()}`}>
                    {order.payment_status}
                  </span>
                </div>

                <div className="mobile-card-body">
                  <div className="mobile-card-name">{order.name}</div>
                  <div className="mobile-card-meta">
                    <span><FiCreditCard className="inline-icon" /> ID: <strong>{order.index_number}</strong></span>
                    <a href={`tel:${order.phone}`} className="mobile-card-phone">
                      <FiPhone className="inline-icon" /> {order.phone}
                    </a>
                  </div>

                  <div className="mobile-card-details-row">
                    <span className="mobile-pill size">Items: <strong>{formatSizePayload(order.size)}</strong></span>
                    <span className="mobile-pill qty">Qty: <strong>{order.quantity}</strong></span>
                    <span className="mobile-card-amount">{formatCurrency(order.amount)}</span>
                  </div>
                </div>

                <div className="mobile-card-footer">
                  <button
                    type="button"
                    className={`mobile-delivery-toggle ${order.delivery_status === 'DELIVERED' ? 'delivered' : 'pending'}`}
                    onClick={() => handleToggleDelivery(order.id, order.delivery_status, order.order_reference)}
                  >
                    {order.delivery_status === 'DELIVERED' ? (
                      <>
                        <FiCheckSquare size={18} color="#16a34a" />
                        <span>DELIVERED</span>
                      </>
                    ) : (
                      <>
                        <FiSquare size={18} color="#d97706" />
                        <span>MARK AS DELIVERED</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className="action-icon-btn view"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <FiEye size={15} />
                    </button>
                    <button
                      type="button"
                      className="action-icon-btn delete"
                      onClick={() => handleDeleteOrder(order.id, order.order_reference)}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="footer" style={{ textAlign: 'center', padding: '1.5rem 0', color: '#94a3b8', fontSize: '0.8rem' }}>
          <p>CKL TECH Admin Panel · {orders.length} order{orders.length !== 1 ? 's' : ''} displayed</p>
        </div>
      </div>

      {/* View Order Detail Modal Card */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div>
                <div className="modal-badge"><FiShoppingBag /> Order Details</div>
                <h3 className="modal-headline" style={{ fontFamily: 'monospace' }}>{selectedOrder.order_reference}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
                <FiX size={22} />
              </button>
            </div>

            <div className="modal-body" style={{ gap: '0.85rem' }}>
              {/* Delivery Toggle Banner in Modal */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: selectedOrder.delivery_status === 'DELIVERED' ? '#dcfce7' : '#fef3c7',
                  border: selectedOrder.delivery_status === 'DELIVERED' ? '1px solid #86efac' : '1px solid #fde047',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  {selectedOrder.delivery_status === 'DELIVERED' ? (
                    <FiCheckCircle size={20} color="#16a34a" />
                  ) : (
                    <FiClock size={20} color="#d97706" />
                  )}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: selectedOrder.delivery_status === 'DELIVERED' ? '#15803d' : '#b45309' }}>
                      Delivery Status
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: selectedOrder.delivery_status === 'DELIVERED' ? '#16a34a' : '#d97706' }}>
                      {selectedOrder.delivery_status === 'DELIVERED' ? 'ITEM DELIVERED' : 'PENDING DELIVERY'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => handleToggleDelivery(selectedOrder.id, selectedOrder.delivery_status, selectedOrder.order_reference)}
                  style={{
                    background: selectedOrder.delivery_status === 'DELIVERED' ? '#ffffff' : '#2563eb',
                    color: selectedOrder.delivery_status === 'DELIVERED' ? '#0f172a' : '#ffffff',
                    border: 'none',
                    fontSize: '0.78rem',
                    padding: '0.4rem 0.75rem',
                  }}
                >
                  {selectedOrder.delivery_status === 'DELIVERED' ? 'Set Pending' : 'Check Delivered'}
                </button>
              </div>

              <div className="summary-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                <div className="summary-row">
                  <span className="label"><FiUser className="inline-icon" /> Student Name</span>
                  <span className="value" style={{ fontSize: '1rem' }}>{selectedOrder.name}</span>
                </div>
                <div className="summary-row">
                  <span className="label"><FiCreditCard className="inline-icon" /> Student ID</span>
                  <span className="value">{selectedOrder.index_number}</span>
                </div>
                <div className="summary-row">
                  <span className="label"><FiPhone className="inline-icon" /> Phone</span>
                  <span className="value">
                    <a href={`tel:${selectedOrder.phone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                      {selectedOrder.phone}
                    </a>
                  </span>
                </div>
              </div>

              <div className="summary-card" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                <div className="summary-row">
                  <span className="label">T-Shirt Size</span>
                  <span className="value" style={{ color: '#2563eb' }}>{formatSizePayload(selectedOrder.size)}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Quantity</span>
                  <span className="value">{selectedOrder.quantity} item{selectedOrder.quantity !== 1 ? 's' : ''}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Total Paid</span>
                  <span className="value" style={{ fontSize: '1.15rem', color: '#16a34a' }}>
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </div>
              </div>

              <div className="summary-card" style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
                <div className="summary-row">
                  <span className="label">Payment Status</span>
                  <span className="value">
                    <span className={`status-badge ${selectedOrder.payment_status.toLowerCase()}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </span>
                </div>
                {selectedOrder.paystack_reference && (
                  <div className="summary-row">
                    <span className="label">Paystack Ref</span>
                    <span className="value" style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {selectedOrder.paystack_reference}
                    </span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="label"><FiCalendar className="inline-icon" /> Date Created</span>
                  <span className="value" style={{ fontSize: '0.8rem' }}>
                    {formatDate(selectedOrder.created_at)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => setSelectedOrder(null)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => handleDeleteOrder(selectedOrder.id, selectedOrder.order_reference)}
                  style={{ background: '#ef4444', color: 'white', border: 'none', gap: '0.4rem' }}
                >
                  <FiTrash2 size={16} /> Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
