import { Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";

function Modal({ type, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});
  const [giftCardList, setGiftCardList] = useState([""]);

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
        { name: "image", label: "Store Icon/Emoji", type: "text" },
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
        { name: "image", label: "Store Icon/Emoji", type: "text" },
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
        { name: "status", label: "Status", type: "text" },
      ],
    },
    "edit-user": {
      title: "Edit User",
      fields: [
        { name: "name", label: "Full Name", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "status", label: "Status", type: "text" },
      ],
    },
  };

  const config = formConfigs[type] || { title: "Form", fields: [] };

  const handleChange = (fieldName) => (e) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
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

  const handleSubmit = () => {
    if (type === "create-store" || type === "edit-store") {
      onSubmit({
        ...formData,
        giftCards: giftCardList.filter((card) => card.trim()),
      });
    } else {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

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

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
