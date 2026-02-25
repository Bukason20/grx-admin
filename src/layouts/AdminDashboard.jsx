import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  Gift,
  Settings,
  X,
  AlertCircle,
  CreditCard,
  DollarSign,
} from "lucide-react";
import Overview from "../pages/Overview";
import GiftCards from "../pages/GiftCards";
import UsersTab from "../pages/Users";
import SettingsTab from "../pages/Settings";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import giftCardStoreService from "../services/giftCardStoreService";
import accountUpgradeService from "../services/accountUpgradeService";
import withdrawalService from "../services/withdrawalService";
import userService from "../services/userService";
import AccountUpgrades from "../pages/AccountUpgrades";
import Withdrawals from "../pages/Withdrawals";

export default function AdminDashboard({ setIsAuthenticated }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalEditData, setModalEditData] = useState(null);

  // ── API data ─────────────────────────────────────────────────────
  const [giftCardStores, setGiftCardStores] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [level2Requests, setLevel2Requests] = useState([]);
  const [level3Requests, setLevel3Requests] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "giftcards", icon: Gift, label: "Gift Cards" },
    { id: "upgrades", icon: CreditCard, label: "Upgrades" },
    { id: "withdrawals", icon: DollarSign, label: "Withdrawals" },
    { id: "users", icon: Users, label: "Users" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch everything at once using allSettled so a single failure
  // doesn't block the rest of the dashboard from loading
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        storesRes,
        cardsRes,
        usersRes,
        level2Res,
        level3Res,
        withdrawalsRes,
      ] = await Promise.allSettled([
        giftCardStoreService.getAllStores(),
        giftCardStoreService.getAllGiftCards(),
        userService.getAllUsers(),
        accountUpgradeService.getPendingLevel2Requests(),
        accountUpgradeService.getPendingLevel3Requests(),
        withdrawalService.getAllWithdrawals(),
      ]);

      if (storesRes.status === "fulfilled") {
        setGiftCardStores(storesRes.value.data);
      } else {
        console.error("❌ Stores:", storesRes.reason);
      }

      if (cardsRes.status === "fulfilled") {
        setGiftCards(cardsRes.value.data);
      } else {
        console.error("❌ Gift cards:", cardsRes.reason);
      }

      if (usersRes.status === "fulfilled") {
        setUsers(usersRes.value.data);
      } else {
        console.error("❌ Users:", usersRes.reason);
      }

      if (level2Res.status === "fulfilled") {
        setLevel2Requests(level2Res.value.data);
      } else {
        console.error("❌ Level 2 requests:", level2Res.reason);
      }

      if (level3Res.status === "fulfilled") {
        setLevel3Requests(level3Res.value.data);
      } else {
        console.error("❌ Level 3 requests:", level3Res.reason);
      }

      if (withdrawalsRes.status === "fulfilled") {
        setWithdrawals(withdrawalsRes.value.data);
      } else {
        console.error("❌ Withdrawals:", withdrawalsRes.reason);
      }
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("❌ fetchAllData:", err);
    } finally {
      setLoading(false);
    }
  };

  // Targeted refresh after any gift card store or card mutation.
  // Always fetches fresh data from the server — never patches local state.
  const fetchGiftCardData = async () => {
    try {
      const [storesRes, cardsRes] = await Promise.all([
        giftCardStoreService.getAllStores(),
        giftCardStoreService.getAllGiftCards(),
      ]);
      setGiftCardStores(storesRes.data);
      setGiftCards(cardsRes.data);
    } catch (err) {
      setError("Failed to refresh gift card data.");
      console.error("❌ fetchGiftCardData:", err);
    }
  };

  // ── Stats computed from real API data ────────────────────────────
  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === "pending",
  ).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active Gift Cards",
      value: giftCards.length.toLocaleString(),
      icon: Gift,
      color: "bg-purple-500",
    },
    {
      label: "Pending Upgrades",
      value: (level2Requests.length + level3Requests.length).toLocaleString(),
      icon: CreditCard,
      color: "bg-green-500",
    },
    {
      label: "Pending Withdrawals",
      value: pendingWithdrawals.toLocaleString(),
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  // ── Auth ─────────────────────────────────────────────────────────
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
      withdrawals: "Withdrawals",
      users: "Users",
      settings: "Settings",
    };
    return titles[activeTab] || "Dashboard";
  };

  // ── Modal ────────────────────────────────────────────────────────
  const openModal = (type, editData = null) => {
    setModalType(type);
    setModalEditData(editData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setModalEditData(null);
  };

  // ── Gift Card Store handlers ─────────────────────────────────────
  // Modal.jsx calls onSubmit(response.data) after the API succeeds.
  // These handlers re-fetch fresh data from the server then close —
  // never manually patch local state to avoid stale/partial data.

  const handleCreateStore = async () => {
    try {
      await fetchGiftCardData();
      closeModal();
      setError(null);
    } catch (err) {
      console.error("❌ handleCreateStore refresh:", err);
      setError("Store created but failed to refresh. Please reload.");
    }
  };

  const handleUpdateStore = async () => {
    try {
      await fetchGiftCardData();
      closeModal();
      setError(null);
    } catch (err) {
      console.error("❌ handleUpdateStore refresh:", err);
      setError("Store updated but failed to refresh. Please reload.");
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await giftCardStoreService.deleteStore(id);
      // Optimistic removal is safe for deletes — nothing to reconstruct
      setGiftCardStores((prev) => prev.filter((store) => store.id !== id));
    } catch (err) {
      setError("Failed to delete store.");
      console.error("❌ handleDeleteStore:", err);
    }
  };

  // ── Gift Card handlers ───────────────────────────────────────────
  const handleCreateCard = async () => {
    try {
      await fetchGiftCardData();
      closeModal();
      setError(null);
    } catch (err) {
      console.error("❌ handleCreateCard refresh:", err);
      setError("Card created but failed to refresh. Please reload.");
    }
  };

  const handleUpdateGiftCard = async () => {
    try {
      await fetchGiftCardData();
      closeModal();
      setError(null);
    } catch (err) {
      console.error("❌ handleUpdateGiftCard refresh:", err);
      setError("Card updated but failed to refresh. Please reload.");
    }
  };

  const handleDeleteGiftCard = async (id) => {
    try {
      await giftCardStoreService.deleteGiftCard(id);
      setGiftCards((prev) => prev.filter((card) => card.id !== id));
    } catch (err) {
      setError("Failed to delete gift card.");
      console.error("❌ handleDeleteGiftCard:", err);
    }
  };

  // ── Upgrade handlers ─────────────────────────────────────────────
  const handleApproveUpgrade = async (credentialId, level) => {
    try {
      if (level === 2) {
        await accountUpgradeService.approveLevel2(credentialId);
        setLevel2Requests((prev) =>
          prev.filter((req) => req.id !== credentialId),
        );
      } else {
        await accountUpgradeService.approveLevel3(credentialId);
        setLevel3Requests((prev) =>
          prev.filter((req) => req.id !== credentialId),
        );
      }
      setError(null);
    } catch (err) {
      setError(`Failed to approve level ${level} upgrade.`);
      console.error("❌ handleApproveUpgrade:", err);
    }
  };

  const handleRejectUpgrade = async (credentialId, level) => {
    try {
      if (level === 2) {
        await accountUpgradeService.rejectLevel2(credentialId);
        setLevel2Requests((prev) =>
          prev.filter((req) => req.id !== credentialId),
        );
      } else {
        await accountUpgradeService.rejectLevel3(credentialId);
        setLevel3Requests((prev) =>
          prev.filter((req) => req.id !== credentialId),
        );
      }
      setError(null);
    } catch (err) {
      setError(`Failed to reject level ${level} upgrade.`);
      console.error("❌ handleRejectUpgrade:", err);
    }
  };

  // ── Modal submit router ──────────────────────────────────────────
  // Modal calls onSubmit(response.data) after API succeeds.
  // Each handler re-fetches from API and closes — no race conditions.
  const getModalSubmitHandler = () => {
    if (modalType === "create-store") return handleCreateStore;
    if (modalType === "edit-store") return handleUpdateStore;
    if (modalType === "create-card") return handleCreateCard;
    if (modalType === "edit-card") return handleUpdateGiftCard;
    return () => closeModal();
  };

  // ── Tab renderer ─────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            stats={stats}
            giftCardStores={giftCardStores}
            giftCards={giftCards}
            users={users}
            withdrawals={withdrawals}
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
      case "withdrawals":
        return (
          <Withdrawals
            withdrawals={withdrawals}
            onViewDetails={(id) => setSelectedWithdrawalId(id)}
            loading={loading}
          />
        );
      case "users":
        return (
          <UsersTab
            users={users}
            onEdit={openModal}
            onDelete={(id) =>
              setUsers((prev) => prev.filter((u) => u.id !== id))
            }
            onCreate={() => openModal("create-user")}
            loading={loading}
          />
        );
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <Overview
            stats={stats}
            giftCardStores={giftCardStores}
            giftCards={giftCards}
            users={users}
            withdrawals={withdrawals}
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
          editData={modalEditData}
          onClose={closeModal}
          onSubmit={getModalSubmitHandler()}
          giftCardStores={giftCardStores}
        />
      )}
    </div>
  );
}
