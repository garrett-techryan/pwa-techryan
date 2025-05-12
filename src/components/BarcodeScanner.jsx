import { Html5QrcodeScanner } from "html5-qrcode";

const BarcodeScanner = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("scanner", {
      fps: 10,
      qrbox: { width: Math.min(250, window.innerWidth * 0.8), height: Math.min(250, window.innerWidth * 0.8) },
    });

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      (error) => {
        console.warn("Scan error", error);
      }
    );

    return () => scanner.clear();
  }, [onScan]);

  return <div id="scanner" />;
};