import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchBoardData, writeBoardData } from "../api/mondayApi";

// Mapping column IDs to friendly names
const columnNameMapping = {
  "date6__1": "Job Date",
  "person": "Assigned To",
  "status__1": "Status",
  "time_tracking5__1": "Timer"
};

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [notesValue, setNotesValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const query = `
      {
        items(ids: ${jobId}) {
          name
          column_values {
            id
            text
          }
        }
      }
    `;

    const loadJob = async () => {
      try {
        const data = await fetchBoardData(query);
        const item = data?.data?.items?.[0];
        setJob(item);

        const notesCol = item.column_values.find(c => c.id === "notes__1");
        setNotesValue(notesCol?.text || "");
      } catch (err) {
        console.error("Failed to load job details", err);
      }
    };

    loadJob();
  }, [jobId]);

  const handleNotesSave = async () => {
    setIsSaving(true);
    const mutation = `
      mutation {
        change_simple_column_value(item_id: ${jobId}, board_id:8068668294, column_id: "notes__1", value: ${JSON.stringify(JSON.stringify(notesValue))}) {
          id
        }
      }
    `;

    try {
      await writeBoardData(mutation);
    } catch (err) {
      console.error("Failed to update notes", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!job) return <div className="p-4">Loading job...</div>;

  const filteredColumns = job.column_values.filter(
    (col) => col.text !== null && columnNameMapping[col.id]
  );

  const handleStatusChange = async (labelIndex) => {
    const mutation = `
      mutation {
        change_simple_column_value(
          item_id: ${jobId},
          board_id: 8068668294,
          column_id: "status__1",
          value: "${labelIndex}"
        ) {
          id
        }
      }
    `;
  
    try {
        await writeBoardData(mutation);
        // Wait a brief moment and reload
        setTimeout(() => {
          window.location.reload();
        }, 500); // delay slightly to ensure the data is saved before reload
      } catch (err) {
        console.error("Failed to update status", err);
      }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-6">{job.name}</h1>
          <ul className="space-y-4">
            {filteredColumns.map((col) => {
              const name = columnNameMapping[col.id];
              if (col.id === "notes") return null; // Handle separately
              return (
                <li key={col.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <div className="font-medium text-lg text-gray-100">
                    <strong>{name}:</strong>
                  </div>
                  <p className="text-gray-200 mt-2">{col.text}</p>
                </li>
              );
            })}
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => handleStatusChange("3")}
                    className="px-4 py-2 bg-techryan-yellow text-white rounded hover:bg-techryan-yellowhover"
                >
                    Start Timer
                </button>
                <button
                    onClick={() => handleStatusChange("4")}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-red-700"
                >
                    Stop Timer
                </button>
            </div>
            {/* Editable Notes Field */}
            <li className="bg-gray-100 p-4 rounded-lg shadow-md">
              <div className="font-medium text-lg">
                <strong>Notes:</strong>
              </div>
              <textarea
                className="w-full mt-2 p-2 border rounded"
                rows="6"
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
              />
              <button
                className="mt-3 px-4 py-2 bg-techryan-yellow text-white rounded hover:bg-techryan-yellowhover"
                onClick={handleNotesSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Notes"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;