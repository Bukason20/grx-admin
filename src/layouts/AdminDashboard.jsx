import React, { useState } from "react";
import {
  BarChart3,
  Users,
  Gift,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import Overview from "../pages/Overview";
import GiftCards from "../pages/GiftCards";
import UsersTab from "../pages/Users";
import SettingsTab from "../pages/Settings";
import Modal from "../components/Modal";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Sample data
  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active Gift Cards",
      value: "8,456",
      change: "+8%",
      icon: Gift,
      color: "bg-purple-500",
    },
    {
      label: "Revenue",
      value: "$125,430",
      change: "+23%",
      icon: BarChart3,
      color: "bg-green-500",
    },
    {
      label: "Redemptions",
      value: "3,892",
      change: "+5%",
      icon: Gift,
      color: "bg-orange-500",
    },
  ];

  const [giftCards, setGiftCards] = useState([
    {
      id: 1,
      name: "$25 Gift Card",
      amount: 25,
      category: "Standard",
      issued: 1240,
      redeemed: 892,
      status: "active",
    },
    {
      id: 2,
      name: "$50 Gift Card",
      amount: 50,
      category: "Premium",
      issued: 856,
      redeemed: 634,
      status: "active",
    },
    {
      id: 3,
      name: "$100 Gift Card",
      amount: 100,
      category: "Premium",
      issued: 432,
      redeemed: 289,
      status: "active",
    },
    {
      id: 4,
      name: "Birthday Special",
      amount: 75,
      category: "Seasonal",
      issued: 567,
      redeemed: 234,
      status: "active",
    },
    {
      id: 5,
      name: "Holiday Bundle",
      amount: 150,
      category: "Bundle",
      issued: 234,
      redeemed: 89,
      status: "inactive",
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Jane Cooper",
      email: "jane@microsoft.com",
      cards: 3,
      spent: "$450",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Floyd Miles",
      email: "floyd@yahoo.com",
      cards: 5,
      spent: "$1,200",
      joinDate: "2023-12-20",
      status: "active",
    },
    {
      id: 3,
      name: "Ronald Richards",
      email: "ronald@adobe.com",
      cards: 2,
      spent: "$320",
      joinDate: "2024-02-10",
      status: "active",
    },
    {
      id: 4,
      name: "Marvin McKinney",
      email: "marvin@tesla.com",
      cards: 1,
      spent: "$100",
      joinDate: "2024-01-25",
      status: "inactive",
    },
    {
      id: 5,
      name: "Jerome Bell",
      email: "jerome@yahoo.com",
      cards: 4,
      spent: "$680",
      joinDate: "2023-11-30",
      status: "active",
    },
  ]);

  const menuItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "giftcards", icon: Gift, label: "Gift Cards" },
    { id: "users", icon: Users, label: "Users" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const getPageTitle = () => {
    const titles = {
      overview: "Overview",
      giftcards: "Gift Cards",
      users: "Users",
      settings: "Settings",
    };
    return titles[activeTab] || "Dashboard";
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleCreateCard = (formData) => {
    const newCard = {
      id: giftCards.length + 1,
      ...formData,
      issued: 0,
      redeemed: 0,
      status: "active",
    };
    setGiftCards([...giftCards, newCard]);
    closeModal();
  };

  const handleCreateUser = (formData) => {
    const newUser = {
      id: users.length + 1,
      ...formData,
      cards: 0,
      spent: "$0",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setUsers([...users, newUser]);
    closeModal();
  };

  const handleDeleteCard = (id) => {
    setGiftCards(giftCards.filter((card) => card.id !== id));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview stats={stats} giftCards={giftCards} />;
      case "giftcards":
        return (
          <GiftCards
            giftCards={giftCards}
            onEdit={openModal}
            onDelete={handleDeleteCard}
            onCreate={() => openModal("create-card")}
          />
        );
      case "users":
        return (
          <UsersTab
            users={users}
            onEdit={openModal}
            onDelete={handleDeleteUser}
            onCreate={() => openModal("create-user")}
          />
        );
      case "settings":
        return <SettingsTab />;
      default:
        return <Overview stats={stats} giftCards={giftCards} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 fixed h-screen overflow-y-auto shadow-lg`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-2xl font-bold">GiftCard</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-purple-700 p-2 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id ? "bg-purple-500" : "hover:bg-purple-700"
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-700 transition ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Filter size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{renderContent()}</div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          type={modalType}
          onClose={closeModal}
          onSubmit={
            modalType === "create-card" ? handleCreateCard : handleCreateUser
          }
        />
      )}
    </div>
  );
}
