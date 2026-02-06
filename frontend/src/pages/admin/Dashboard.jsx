import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiFileText, FiMessageSquare, FiTag, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import { dashboardService } from '../../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, invoicesRes, enquiriesRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentInvoices(),
          dashboardService.getRecentEnquiries()
        ]);
        setStats(statsRes.data);
        setRecentInvoices(invoicesRes.data);
        setRecentEnquiries(enquiriesRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statCards = stats ? [
    {
      title: 'Total Products',
      value: stats.products.total,
      subtitle: `${stats.products.active} active`,
      icon: <FiPackage className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/products'
    },
    {
      title: 'Total Customers',
      value: stats.customers.total,
      subtitle: `${stats.customers.active} active`,
      icon: <FiUsers className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/customers'
    },
    {
      title: 'Total Invoices',
      value: stats.invoices.total,
      subtitle: `${stats.invoices.pending} pending`,
      icon: <FiFileText className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/invoices'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.invoices.total_revenue),
      subtitle: `${stats.invoices.paid} paid invoices`,
      icon: <FiDollarSign className="w-8 h-8" />,
      color: 'bg-yellow-500',
      link: '/admin/invoices'
    },
    {
      title: 'New Enquiries',
      value: stats.enquiries.new,
      subtitle: `${stats.enquiries.total} total`,
      icon: <FiMessageSquare className="w-8 h-8" />,
      color: 'bg-red-500',
      link: '/admin/enquiries'
    },
    {
      title: 'Active Offers',
      value: stats.offers.active,
      subtitle: 'Currently active',
      icon: <FiTag className="w-8 h-8" />,
      color: 'bg-pink-500',
      link: '/admin/offers'
    }
  ] : [];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Nellusoru Admin</h1>
        <p className="text-primary-100">Manage your products, customers, invoices, and more.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                <p className="text-gray-400 text-sm mt-1">{card.subtitle}</p>
              </div>
              <div className={`${card.color} text-white p-3 rounded-xl`}>
                {card.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
            <Link to="/admin/invoices" className="text-primary-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentInvoices.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No invoices yet</div>
            ) : (
              recentInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-500">{invoice.customer_name || 'Walk-in'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-primary-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y">
            {recentEnquiries.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No enquiries yet</div>
            ) : (
              recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{enquiry.name}</p>
                      <p className="text-sm text-gray-500">{enquiry.subject || 'General Enquiry'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{enquiry.phone}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(enquiry.status)}`}>
                        {enquiry.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
