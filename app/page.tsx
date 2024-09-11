"use client"; // Required for client-side components in the App Router

import { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [items, setItems] = useState([]); 
  const [currentItem, setCurrentItem] = useState({ id: null, text: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("https://nodejs-project-two.vercel.app/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentItem({ ...currentItem, text: e.target.value });
  };

  // Add item (POST request)
  const addItem = async () => {
    if (currentItem.text.trim() === "") return;
    try {
      const response = await axios.post("https://nodejs-project-two.vercel.app/items", {
        name: currentItem.text,
      });
      setItems([...items, response.data]); // Update with new item
      setCurrentItem({ id: null, text: "" });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Edit item
  const editItem = (item: { id: number; text: string }) => {
    setIsEditing(true);
    setCurrentItem(item);
  };

  // Update item (PUT request)
  const updateItem = async () => {
    try {
      await axios.put(`https://nodejs-project-two.vercel.app/items/${currentItem.id}`, {
        name: currentItem.text,
      });
      setItems(
        items.map((item) =>
          item._id === currentItem.id ? { ...item, name: currentItem.text } : item
        )
      );
      setCurrentItem({ id: null, text: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Delete item (DELETE request)
  const deleteItem = async (id: number) => {
    try {
      await axios.delete(`https://nodejs-project-two.vercel.app/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">CRUD List</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter item"
          className="border rounded p-2 w-full"
          value={currentItem.text}
          onChange={handleInputChange}
        />
        <button
          className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded ${
            currentItem.text.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={isEditing ? updateItem : addItem}
          disabled={currentItem.text.trim() === ""}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>

      <ul className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <li
              key={item._id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{item.name}</span>
              <div className="space-x-2">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => editItem({ id: item._id, text: item.name })}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">No items added yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
