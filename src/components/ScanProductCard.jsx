import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchBoardData } from "../api/mondayApi";

const ScanProductCard = ({ parentItemId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isModalOpen && document.getElementById("scanner")) {
      scannerRef.current = new Html5QrcodeScanner("scanner", {
        fps: 10,
        qrbox: { width: 300, height: 300 }, // Increased for compatibility
      });

      scannerRef.current.render(
        (decodedText) => {
          setScannedCode(decodedText);
          setIsModalOpen(false);
        },
        (error) => {
          console.warn("Scan error", error);
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) =>
          console.error("Failed to clear scanner", err)
        );
      }
    };
  }, [isModalOpen]);

  const submitProduct = async () => {
    if (!scannedCode || quantity < 1) return;

    setSubmitting(true);
    try {
      const createSubitemQuery = `
        mutation {
          create_subitem(parent_item_id: ${parentItemId}, item_name: "UPC: ${scannedCode}") {
            id
          }
        }
      `;
      const createResponse = await fetchBoardData(createSubitemQuery);
      const newItemId = createResponse?.data?.create_subitem?.id;

      if (newItemId) {
        const updateQuantityQuery = `
          mutation {
            change_column_value(
              item_id: ${newItemId},
              board_id: 8068668467,
              column_id: "numeric_mkqw877m",
              value: "${quantity}"
            ) {
              id
            }
          }
        `;
        await fetchBoardData(updateQuantityQuery);
      }

      setScannedCode("");
      setQuantity(1);
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-zinc-700 rounded shadow mb-4">
      <h2 className="text-lg font-semibold mb-2 text-white">Add Product via Scan</h2>

      {!scannedCode && (
        <button
          className="bg-techryan-yellow text-white px-4 py-2 rounded hover:bg-techryan-yellowhover"
          onClick={() => setIsModalOpen(true)}
        >
          Scan Barcode
        </button>
      )}

      {scannedCode && (
        <div className="mt-4 text-gray-100">
          <p className="mb-2">Scanned: <strong>{scannedCode}</strong></p>
          <label className="block mb-2">
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="ml-2 p-1 rounded text-gray-100 bg-zinc-600 border border-zinc-500"
              min={1}
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={submitProduct}
              disabled={submitting}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {submitting ? "Adding..." : "Add Product"}
            </button>
            <button
              onClick={() => {
                setScannedCode("");
                setIsModalOpen(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Rescan
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Scan a Product</h2>
            <div id="scanner" className="w-full h-[400px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanProductCard;
