import { LogOut, X } from "lucide-react";

function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab, menuItems }) {
  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-purple-600 to-purple-800 text-white transition-all duration-300 fixed h-screen overflow-y-auto shadow-lg`}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && <h1 className="text-2xl font-bold">GiftCard</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-purple-700 p-2 rounded"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
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
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-8 left-4 right-4">
        <button
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-700 transition ${
            !isOpen ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
