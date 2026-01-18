// ============================================
// Modal.jsx - FIXED (Cards as Array)
// ============================================
import React, { useState } from "react";
import { X, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import giftCardStoreService from "../services/giftCardStoreService";

function ModalComponent({ type, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [giftCardList, setGiftCardList] = useState([""]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const formConfigs = {
    "create-store": {
      title: "Create Gift Card Store",
      fields: [
        { name: "name", label: "Store Name", type: "text" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["All", "Popular", "Shopping"],
        },
        { name: "rate", label: "Rate ($)", type: "number" },
        { name: "image", label: "Store Image", type: "file" },
        { name: "description", label: "Description", type: "text" },
      ],
    },
    "edit-store": {
      title: "Edit Gift Card Store",
      fields: [
        { name: "name", label: "Store Name", type: "text" },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["All", "Popular", "Shopping"],
        },
        { name: "rate", label: "Rate ($)", type: "number" },
        { name: "image", label: "Store Image", type: "file" },
        { name: "description", label: "Description", type: "text" },
      ],
    },
    "create-card": {
      title: "Create Gift Card",
      fields: [
        { name: "name", label: "Card Name", type: "text" },
        { name: "storeId", label: "Store", type: "text" },
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

  const handleGiftCardChange = (index, value) => {
    const newList = [...giftCardList];
    newList[index] = value;
    setGiftCardList(newList);
  };

  const addGiftCard = () => {
    setGiftCardList([...giftCardList, ""]);
  };

  const removeGiftCard = (index) => {
    setGiftCardList(giftCardList.filter((_, i) => i !== index));
  };

  const logFormData = (formDataObj) => {
    console.log("FormData Contents:");
    console.log("====================");

    for (let [key, value] of formDataObj.entries()) {
      if (value instanceof File) {
        console.log(`✓ ${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`✓ ${key}:`, value);
      }
    }
    console.log("====================");
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
      if (!formData.rate) {
        setError("Rate is required");
        return;
      }
      if (!formData.description) {
        setError("Description is required");
        return;
      }

      setLoading(true);

      try {
        // Create FormData for multipart/form-data
        const formDataToSend = new FormData();

        console.log("📝 Form Data Before Submission:", formData);
        console.log("🎁 Gift Cards List:", giftCardList);

        // Append basic fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("rate", formData.rate);
        formDataToSend.append("description", formData.description);

        // Add image if it exists
        if (formData.image instanceof File) {
          console.log("✅ Image found, appending to FormData");
          formDataToSend.append("image", formData.image);
        } else {
          console.log("⚠️ No image file found");
        }

        // ============================================
        // FIX: Send cards as array of objects/dictionaries
        // ============================================
        const cardsToAdd = giftCardList
          .filter((card) => card.trim())
          .map((card) => ({
            name: card.trim(), // Each card is now an object with 'name' property
          }));

        console.log("🎴 Cards to add:", cardsToAdd);

        // CORRECT: Send as JSON array of objects
        formDataToSend.append("cards", JSON.stringify(cardsToAdd));
        console.log(
          "✅ Cards appended as JSON array of objects:",
          JSON.stringify(cardsToAdd)
        );

        // LOG THE COMPLETE FORMDATA
        console.log("🚀 Complete FormData being sent:");
        logFormData(formDataToSend);

        let response;
        if (type === "create-store") {
          console.log("📤 Sending POST request to /admin/create-gift-store/");
          response = await giftCardStoreService.createStore(formDataToSend);
          console.log("✅ Success Response:", response.data);
        } else {
          console.log(`📤 Sending PUT request for store ID: ${formData.id}`);
          response = await giftCardStoreService.updateStore(
            formData.id,
            formDataToSend
          );
          console.log("✅ Success Response:", response.data);
        }

        setSuccess("Store created successfully!");
        setTimeout(() => {
          onSubmit(response.data);
          handleClose();
        }, 1500);
      } catch (err) {
        console.error("❌ Error occurred:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          message: err.message,
        });

        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            "Failed to create store. Please try again."
        );

        setLoading(false);
      }
    } else {
      // For non-store forms (users, etc)
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setFormData({});
    setGiftCardList([""]);
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

          {/* Gift Card Names Section */}
          {(type === "create-store" || type === "edit-store") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gift Card Names
              </label>
              <div className="space-y-2">
                {giftCardList.map((card, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Card Name ${index + 1}`}
                      value={card}
                      onChange={(e) =>
                        handleGiftCardChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {giftCardList.length > 1 && (
                      <button
                        onClick={() => removeGiftCard(index)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                        title="Remove card"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addGiftCard}
                className="mt-2 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center gap-2 text-sm"
              >
                <Plus size={16} /> Add Gift Card
              </button>
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
