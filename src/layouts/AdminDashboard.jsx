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
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminDashboard({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    // Update auth state
    setIsAuthenticated(false);
  };

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

  const [giftCardStores, setGiftCardStores] = useState([
    {
      id: 1,
      name: "Amazon",
      category: "Popular",
      rate: 1000,
      image: "🛍️",
      description: "Amazon Gift Cards",
      giftCards: ["$25", "$50", "$100"],
      issued: 1240,
      redeemed: 892,
      status: "active",
    },
    {
      id: 2,
      name: "Apple Store",
      category: "Popular",
      rate: 500,
      image: "🍎",
      description: "Apple Store Gift Cards",
      giftCards: ["$25", "$100"],
      issued: 856,
      redeemed: 634,
      status: "active",
    },
    {
      id: 3,
      name: "Xbox Store",
      category: "Shopping",
      rate: 750,
      image: "🎮",
      description: "Xbox Game Pass",
      giftCards: ["$30", "$60", "$150"],
      issued: 432,
      redeemed: 289,
      status: "active",
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

  const handleCreateStore = (formData) => {
    const newStore = {
      id: giftCardStores.length + 1,
      ...formData,
      giftCards: formData.giftCards || [],
      issued: 0,
      redeemed: 0,
      status: "active",
    };
    setGiftCardStores([...giftCardStores, newStore]);
    closeModal();
  };

  const handleDeleteStore = (id) => {
    setGiftCardStores(giftCardStores.filter((store) => store.id !== id));
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

  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview stats={stats} giftCardStores={giftCardStores} />;
      case "giftcards":
        return (
          <GiftCards
            giftCardStores={giftCardStores}
            onEdit={openModal}
            onDelete={handleDeleteStore}
            onCreate={() => openModal("create-store")}
          />
        );
      case "users":
        return (
          <Users
            users={users}
            onEdit={openModal}
            onDelete={handleDeleteUser}
            onCreate={() => openModal("create-user")}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return <Overview stats={stats} giftCardStores={giftCardStores} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
      />
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        <Header pageTitle={getPageTitle()} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{renderContent()}</div>
        </main>
      </div>

      {showModal && (
        <Modal
          type={modalType}
          onClose={closeModal}
          onSubmit={
            modalType === "create-store" || modalType === "edit-store"
              ? handleCreateStore
              : handleCreateUser
          }
        />
      )}
    </div>
  );
}
