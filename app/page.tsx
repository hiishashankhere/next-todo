"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "update">("add");
  const [currentTodo, setCurrentTodo] = useState<any>(null);

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/auth/todo");
        if (res.ok) {
          const data = await res.json();
          setTodos(data.todos);
        }
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, []);

  // Modal handlers
  const openAddModal = () => {
    setModalMode("add");
    setCurrentTodo({ title: "", description: "" });
    setIsModalOpen(true);
  };

  const openUpdateModal = (todo: any) => {
    setModalMode("update");
    setCurrentTodo({ ...todo });
    setIsModalOpen(true);
  };

  // Save / Update Todo
  const handleSave = async () => {
    if (!currentTodo.title.trim()) return;
    if (modalMode === "add") {
      // Create Todo
      const res = await fetch("/api/auth/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTodo),
      });
      const { todo: newTodo } = await res.json();
      setTodos([...todos, newTodo]);
    } else if (modalMode === "update") {
      // Update Todo
      const res = await fetch(`/api/auth/todo/${currentTodo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTodo),
      });
      const { todo: updatedTodo } = await res.json();
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    }

    setIsModalOpen(false);
  };

  // Delete Todo
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/auth/todo/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  console.log(todos);

  return (
    <div className="font-sans flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 sm:p-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 drop-shadow-sm">
        ✨ Simple Todo App
      </h1>

      {/* Card Wrapper */}
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Table */}
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(todos) && todos.length > 0 ? (
              todos.map((todo, index) => (
                <tr
                  key={todo.id}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4 text-gray-900 font-semibold">
                    {todo.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{todo.description}</td>
                  <td className="px-6 py-4 flex justify-center gap-3">
                    <button
                      className="px-4 py-1.5 text-sm rounded-lg bg-blue-500 text-white shadow hover:bg-blue-600 active:scale-95 transition"
                      onClick={() => openUpdateModal(todo)}
                    >
                      Update
                    </button>
                    <button
                      className="px-4 py-1.5 text-sm rounded-lg bg-red-500 text-white shadow hover:bg-red-600 active:scale-95 transition"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No todos yet. Add one!
                </td>
              </tr>
            )}
          </tbody>

        </table>

        {/* Add Button */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-green-500 text-white shadow hover:bg-green-600 active:scale-95 transition"
            onClick={openAddModal}
          >
            ➕ Add Todo
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {modalMode === "add" ? "Add New Todo" : "Update Todo"}
            </h2>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter todo title"
                  value={currentTodo?.title || ""}
                  onChange={(e) =>
                    setCurrentTodo({ ...currentTodo, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter todo description"
                  value={currentTodo?.description || ""}
                  onChange={(e) =>
                    setCurrentTodo({
                      ...currentTodo,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                  rows={3}
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 active:scale-95 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-5 py-2 rounded-lg font-semibold text-white shadow active:scale-95 transition ${modalMode === "add"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
                  }`}
                onClick={handleSave}
              >
                {modalMode === "add" ? "Save Todo" : "Update Todo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
