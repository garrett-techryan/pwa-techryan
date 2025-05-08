import React, { useEffect, useState } from "react";
import { fetchBoardData } from "../api/mondayApi";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadItems = async () => {
      const query = `
        {
          boards(ids: 8068668294) {
            items_page(limit: 100) {
              items {
                id
                name
                column_values(ids: ["date6__1"]) {
                  id
                  text
                }
              }
            }
          }
        }
      `;
      try {
        const data = await fetchBoardData(query);
        let items = data?.data?.boards?.[0]?.items_page?.items || [];
  
        const today = new Date();
        today.setHours(0, 0, 0, 0); // zero out time for accurate comparison
  
        // Filter and sort
        items = items
          .map(item => {
            const dateText = item.column_values?.find(col => col.id === "date6__1")?.text;
            const parsedDate = dateText ? new Date(dateText) : null;
            return { ...item, parsedDate };
          })
          .filter(item => item.parsedDate && item.parsedDate >= today)
          .sort((a, b) => a.parsedDate - b.parsedDate);
  
        setItems(items);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };
  
    loadItems();
  }, []);

  const getDate = (item) =>
    item.parsedDate ? item.parsedDate.toLocaleDateString() : "No date";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <ul className="space-y-2">
      {items.map((item) => (
  <li key={item.id} className="bg-white p-3 rounded shadow hover:bg-gray-50">
    <Link to={`/job/${item.id}`} className="block">
      <strong>{item.name}</strong>
      <div className="text-sm text-gray-500">
        Date: {getDate(item)}
      </div>
    </Link>
  </li>
))}
      </ul>
    </div>
  );
};

export default Dashboard;
