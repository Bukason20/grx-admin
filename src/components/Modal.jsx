import { X } from "lucide-react";
import React, { useState } from "react";

function Modal({ type, onClose, onSubmit }) {
  const [formData, setFormData] = useState({});

  const formConfigs = {
    "create-card": {
      title: "Create Gift Card",
      fields: [
        { name: "name", label: "Card Name", type: "text" },
        { name: "amount", label: "Amount", type: "number" },
        { name: "category", label: "Category", type: "text" },
        { name: "description", label: "Description", type: "text" },
      ],
    },
    "edit-card": {
      title: "Edit Gift Card",
      fields: [
        { name: "name", label: "Card Name", type: "text" },
        { name: "amount", label: "Amount", type: "number" },
        { name: "category", label: "Category", type: "text" },
        { name: "status", label: "Status", type: "text" },
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

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
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
              <input
                type={field.type}
                placeholder={field.label}
                value={formData[field.name] || ""}
                onChange={handleChange(field.name)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
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
