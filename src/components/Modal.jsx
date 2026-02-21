import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import giftCardStoreService from "../services/giftCardStoreService";

function ModalComponent({ type, onClose, onSubmit, giftCardStores = [] }) {
  const [formData, setFormData] = useState({});
  const [cards, setCards] = useState([{ type: "Both", name: "", rate: "" }]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // For searchable store select (create-card)
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const dropdownRef = useRef(null);

  const formConfigs = {
    "create-store": {
      title: "Create Gift Card Store",
      fields: [
        { name: "name", label: "Name", type: "text" },
        { name: "image", label: "Image", type: "file" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["All", "Popular", "Shopping"],
        },
      ],
    },
    "create-card": {
      title: "Create Gift Card",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "select",
          options: ["Both", "Physical", "E-code"],
        },
        { name: "name", label: "Name", type: "text" },
        { name: "rate", label: "Rate", type: "number" },
        // Store field is handled separately with searchable select
      ],
    },
    "create-user": {
      title: "Add User",
      fields: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Phone", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
    "edit-store": {
      title: "Edit Gift Card Store",
      fields: [
        { name: "name", label: "Name", type: "text" },
        { name: "image", label: "Image", type: "file" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["All", "Popular", "Shopping"],
        },
      ],
    },
    "edit-user": {
      title: "Edit User",
      fields: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["active", "inactive"],
        },
      ],
    },
  };

  const config = formConfigs[type] || { title: "Form", fields: [] };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowStoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("📸 Image selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value };
    setCards(updatedCards);
  };

  const addCard = () => {
    setCards([...cards, { type: "Both", name: "", rate: "" }]);
  };

  const removeCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  // Filter stores based on search
  const filteredStores = giftCardStores.filter((store) =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase()),
  );

  const selectStore = (storeId, storeName) => {
    setSelectedStoreId(storeId);
    setFormData({ ...formData, store: storeId });
    setStoreSearchTerm(storeName);
    setShowStoreDropdown(false);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (type === "create-store" || type === "edit-store") {
      // Validate required fields
      if (!formData.name) {
        setError("Store name is required");
        return;
      }
      if (!formData.category) {
        setError("Category is required");
        return;
      }

      // Validate at least one card
      if (cards.length === 0) {
        setError("Add at least one gift card");
        return;
      }

      // Validate all cards have name and rate
      for (let card of cards) {
        if (!card.name) {
          setError("All cards must have a name");
          return;
        }
        if (!card.rate) {
          setError("All cards must have a rate");
          return;
        }
      }

      setLoading(true);

      try {
        const formDataToSend = new FormData();

        console.log("📝 Form Data Before Submission:", formData);
        console.log("🎁 Cards List:", cards);

        // Append basic fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("category", formData.category);

        // Add image if it exists
        if (formData.image instanceof File) {
          console.log("✅ Image found, appending to FormData");
          formDataToSend.append("image", formData.image);
        } else {
          console.log("⚠️ No image file found");
        }

        // Send cards with all their properties
        const cardsToAdd = cards.map((card) => ({
          type: card.type || "Both",
          name: card.name.trim(),
          rate: parseFloat(card.rate),
        }));

        console.log("🎴 Cards to add:", cardsToAdd);

        formDataToSend.append("cards", JSON.stringify(cardsToAdd));
        console.log("✅ Cards appended as JSON:", JSON.stringify(cardsToAdd));

        let response;
        if (type === "create-store") {
          console.log("📤 Sending POST request to /admin/create-gift-store/");
          response = await giftCardStoreService.createStore(formDataToSend);
          console.log("✅ Success Response:", response.data);
        } else {
          console.log(`📤 Sending PUT request for store ID: ${formData.id}`);
          response = await giftCardStoreService.updateStore(
            formData.id,
            formDataToSend,
          );
          console.log("✅ Success Response:", response.data);
        }

        setSuccess("Store created successfully!");

        setTimeout(() => {
          console.log("📦 Passing response.data to onSubmit:", response.data);
          onSubmit(response.data);
          handleClose();
        }, 1500);
      } catch (err) {
        console.error("❌ Error occurred:", err);
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            "Failed to create store. Please try again.",
        );
        setLoading(false);
      }
    } else if (type === "create-card") {
      // Validate gift card fields
      if (!formData.type) {
        setError("Type is required");
        return;
      }
      if (!formData.name) {
        setError("Card name is required");
        return;
      }
      if (!formData.rate) {
        setError("Rate is required");
        return;
      }
      if (!selectedStoreId) {
        setError("Please select a store");
        return;
      }

      setLoading(true);

      try {
        const giftCardData = {
          type: formData.type,
          name: formData.name,
          rate: parseFloat(formData.rate),
          store: selectedStoreId,
        };

        console.log("🎴 Gift Card Data:", giftCardData);

        const response =
          await giftCardStoreService.createGiftCard(giftCardData);
        console.log("✅ Gift Card Created:", response.data);

        setSuccess("Gift card created successfully!");

        setTimeout(() => {
          onSubmit(response.data);
          handleClose();
        }, 1500);
      } catch (err) {
        console.error("❌ Error creating gift card:", err);
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            "Failed to create gift card. Please try again.",
        );
        setLoading(false);
      }
    } else {
      // For non-store/card forms (users, etc)
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setFormData({});
    setCards([{ type: "Both", name: "", rate: "" }]);
    setStoreSearchTerm("");
    setSelectedStoreId(null);
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-4">
          {/* CREATE CARD FORM - Different structure than other forms */}
          {type && type === "create-card" ? (
            <>
              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type || ""}
                  onChange={handleChange("type")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select Type</option>
                  <option value="Both">Both</option>
                  <option value="Physical">Physical</option>
                  <option value="E-code">E-code</option>
                </select>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter gift card name"
                  value={formData.name || ""}
                  onChange={handleChange("name")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Rate Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate
                </label>
                <input
                  type="number"
                  placeholder="Enter rate"
                  step="0.01"
                  min="0"
                  value={formData.rate || ""}
                  onChange={handleChange("rate")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Searchable Store Select */}
              <div ref={dropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search and select a store..."
                    value={storeSearchTerm}
                    onChange={(e) => {
                      setStoreSearchTerm(e.target.value);
                      setShowStoreDropdown(true);
                      setSelectedStoreId(null);
                    }}
                    onFocus={() => setShowStoreDropdown(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {/* Dropdown */}
                  {showStoreDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {filteredStores.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">
                          {giftCardStores.length === 0
                            ? "No stores available"
                            : "No stores found"}
                        </div>
                      ) : (
                        filteredStores.map((store) => (
                          <div
                            key={store.id}
                            onClick={() => selectStore(store.id, store.name)}
                            className={`px-4 py-3 cursor-pointer transition ${
                              selectedStoreId === store.id
                                ? "bg-purple-100 text-purple-900"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            {store.name}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Other form types - original logic */}
              {config.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>

                  {field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={handleChange(field.name)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options &&
                        field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                    </select>
                  ) : field.type === "file" ? (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      {imagePreview && (
                        <div className="mt-4 flex justify-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border-2 border-purple-300 shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.label}
                      value={formData[field.name] || ""}
                      onChange={handleChange(field.name)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Gift Cards Section - For Store Creation */}
          {(type === "create-store" || type === "edit-store") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift Cards
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    {/* Card Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={card.type}
                        onChange={(e) =>
                          handleCardChange(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="Both">Both</option>
                        <option value="Physical">Physical</option>
                        <option value="E-code">E-code</option>
                      </select>
                    </div>

                    {/* Card Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        placeholder="Card name"
                        value={card.name}
                        onChange={(e) =>
                          handleCardChange(index, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    {/* Card Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rate ($)
                      </label>
                      <input
                        type="number"
                        placeholder="Rate"
                        step="0.01"
                        min="0"
                        value={card.rate}
                        onChange={(e) =>
                          handleCardChange(index, "rate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    {/* Remove Button */}
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCard(index)}
                        className="w-full px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 size={16} /> Remove Card
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Card Button */}
                <button
                  type="button"
                  onClick={addCard}
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Another Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalComponent;
