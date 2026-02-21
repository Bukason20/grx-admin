import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Gift,
  Settings,
  X,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import Overview from "../pages/Overview";
import GiftCards from "../pages/GiftCards";
import UsersTab from "../pages/Users";
import SettingsTab from "../pages/Settings";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import giftCardStoreService from "../services/giftCardStoreService";
import AccountUpgrades from "../pages/AccountUpgrades";

export default function AdminDashboard({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [giftCardStores, setGiftCardStores] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [level2Requests, setLevel2Requests] = useState([]);
  const [level3Requests, setLevel3Requests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    { id: "upgrades", icon: CreditCard, label: "Upgrades" },
    { id: "users", icon: Users, label: "Users" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  // Fetch gift card stores and cards on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stores
      const storesResponse = await giftCardStoreService.getAllStores();
      console.log("✅ Stores fetched:", storesResponse.data);
      setGiftCardStores(storesResponse.data);

      // Fetch gift cards
      const cardsResponse = await giftCardStoreService.getAllGiftCards();
      console.log("✅ Gift cards fetched:", cardsResponse.data);
      setGiftCards(cardsResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to fetch data. Please try again.",
      );
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  const getPageTitle = () => {
    const titles = {
      overview: "Overview",
      giftcards: "Gift Cards",
      upgrades: "Account Upgrades",
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

  const handleCreateStore = async (newStoreData) => {
    try {
      const storeToAdd = {
        id: newStoreData.id || Date.now(),
        name: newStoreData.name,
        category: newStoreData.category,
        image: newStoreData.image || null,
        cards: newStoreData.cards || [],
        status: newStoreData.status || "active",
      };

      console.log("✅ Adding store to state:", storeToAdd);

      setGiftCardStores([...giftCardStores, storeToAdd]);
      closeModal();
      setError(null);
    } catch (err) {
      console.error("❌ Error handling store creation:", err);
      setError("Failed to add store to list. Please try again.");
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await giftCardStoreService.deleteStore(id);
      setGiftCardStores(giftCardStores.filter((store) => store.id !== id));
    } catch (err) {
      setError("Failed to delete store");
      console.error("Error deleting store:", err);
    }
  };

  const handleDeleteGiftCard = async (id) => {
    try {
      await giftCardStoreService.deleteGiftCard(id);
      setGiftCards(giftCards.filter((card) => card.id !== id));
    } catch (err) {
      setError("Failed to delete gift card");
      console.error("Error deleting gift card:", err);
    }
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

  const handleApproveUpgrade = async (credentialId, level) => {
    try {
      if (level === 2) {
        await accountUpgradeService.approveLevel2(credentialId);
        setLevel2Requests(
          level2Requests.filter((req) => req.id !== credentialId),
        );
      } else {
        await accountUpgradeService.approveLevel3(credentialId);
        setLevel3Requests(
          level3Requests.filter((req) => req.id !== credentialId),
        );
      }
      setError(null);
    } catch (err) {
      setError(`Failed to approve level ${level} upgrade`);
      console.error("Error approving upgrade:", err);
    }
  };

  const handleRejectUpgrade = async (credentialId, level) => {
    try {
      if (level === 2) {
        await accountUpgradeService.rejectLevel2(credentialId);
        setLevel2Requests(
          level2Requests.filter((req) => req.id !== credentialId),
        );
      } else {
        await accountUpgradeService.rejectLevel3(credentialId);
        setLevel3Requests(
          level3Requests.filter((req) => req.id !== credentialId),
        );
      }
      setError(null);
    } catch (err) {
      setError(`Failed to reject level ${level} upgrade`);
      console.error("Error rejecting upgrade:", err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            stats={stats}
            giftCardStores={giftCardStores}
            loading={loading}
          />
        );
      case "giftcards":
        return (
          <GiftCards
            giftCardStores={giftCardStores}
            giftCards={giftCards}
            onEdit={openModal}
            onDelete={handleDeleteStore}
            onDeleteCard={handleDeleteGiftCard}
            onCreate={openModal}
            loading={loading}
          />
        );
      case "upgrades":
        return (
          <AccountUpgrades
            level2Requests={level2Requests}
            level3Requests={level3Requests}
            onApprove={handleApproveUpgrade}
            onReject={handleRejectUpgrade}
            loading={loading}
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
        return (
          <Overview
            stats={stats}
            giftCardStores={giftCardStores}
            loading={loading}
          />
        );
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
        handleLogout={handleLogout}
      />
      <div
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } flex-1 flex flex-col overflow-hidden transition-all duration-300`}
      >
        <Header pageTitle={getPageTitle()} />

        {/* Error Banner */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X size={18} />
            </button>
          </div>
        )}

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
              : modalType === "create-card"
                ? (data) => {
                    // After creating a gift card, refetch the data
                    fetchData();
                    closeModal();
                  }
                : handleCreateUser
          }
          giftCardStores={giftCardStores}
        />
      )}
    </div>
  );
}
