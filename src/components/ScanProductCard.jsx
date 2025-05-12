import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { fetchBoardData } from "../api/mondayApi";

const ScanProductCard = ({ parentItemId }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

const startScanner = () => {
    setScanning(true);
};

useEffect(() => {
    if (scanning && document.getElementById("scanner")) {
        const scanner = new Html5QrcodeScanner("scanner", { fps: 10, qrbox: 250 });

        scanner.render(
        (decodedText) => {
            setScannedCode(decodedText);
            scanner.clear();
            setScanning(false);
        },
        (error) => {
            console.warn("Scan error", error);
        }
        );
    }
    }, [scanning]);

  const submitProduct = async () => {
    if (!scannedCode || quantity < 1) return;

    setSubmitting(true);

    try {
      // 1. Create subitem
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
        // 2. Update quantity column
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
      <h2 className="text-lg font-semibold mb-2 text-gray-100">Add Product via Scan</h2>

      {!scannedCode && !scanning && (
        <button
          className="bg-techryan-yellow text-white px-4 py-2 rounded hover:bg-techryan-yellowhover"
          onClick={startScanner}
        >
          Scan Barcode
        </button>
      )}

      {scanning && <div id="scanner" className="mb-4" />}

      {scannedCode && (
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-100">Scanned UPC:</label>
            <div className="p-2 bg-gray-100 rounded bg-zinc-500 text-gray-100 border-zinc-500">{scannedCode}</div>
          </div>
          <div>
            <label className="block font-medium text-gray-100">Quantity:</label>
            <input
              type="number"
              value={quantity}
              min={1}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border p-2 rounded w-full bg-zinc-500 text-gray-100 border-zinc-500"
            />
          </div>
          <button
            onClick={submitProduct}
            disabled={submitting}
            className="bg-techryan-yellow text-white px-4 py-2 rounded hover:bg-techryan-yellowhover"
          >
            {submitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanProductCard;
