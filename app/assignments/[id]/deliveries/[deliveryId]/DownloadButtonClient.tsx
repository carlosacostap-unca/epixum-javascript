"use client";

import { useState } from "react";
import { getDeliveryDownloadUrl } from "@/lib/actions";

export default function DownloadButtonClient({ deliveryId }: { deliveryId: string }) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    setDownloadingId(id);
    try {
      const result = await getDeliveryDownloadUrl(id);
      if (result.success && result.url) {
        window.open(result.url, '_blank');
      } else {
        alert(result.error || "No se pudo obtener el enlace de descarga");
      }
    } catch (err) {
      console.error(err);
      alert("Error al intentar descargar el archivo");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <button
      onClick={() => handleDownload(deliveryId)}
      disabled={downloadingId === deliveryId}
      className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {downloadingId === deliveryId ? (
        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      ) : (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 9V3.5L18.5 9M6 2c-1.11 0-1.99.89-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6z" />
        </svg>
      )}
      Descargar Entrega (ZIP)
    </button>
  );
}
