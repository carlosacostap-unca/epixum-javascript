"use client";

import { Link as LinkType } from "@/types";
import { getResourceDownloadUrl } from "@/lib/actions";

interface ResourceListProps {
  links: LinkType[];
}

export default function ResourceList({ links }: ResourceListProps) {
  const isFileResource = (link: LinkType) => {
    return link.type === 'file' || 
           link.url.includes('idrivee2.com') || 
           link.url.includes('epixum-javascript-storage');
  };

  const handleResourceClick = async (e: React.MouseEvent, link: LinkType) => {
    if (isFileResource(link)) {
        e.preventDefault();
        try {
            const result = await getResourceDownloadUrl(link.id);
            if (result.success && result.url) {
                window.open(result.url, '_blank');
            } else {
                alert("No se pudo descargar el archivo.");
            }
        } catch (error) {
            console.error(error);
            alert("Error al descargar el archivo.");
        }
    }
  };

  if (links.length === 0) {
    return <p className="text-zinc-500">No hay enlaces disponibles para este trabajo práctico.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {links.map((link) => (
        <a 
          href={isFileResource(link) ? '#' : link.url} 
          target={isFileResource(link) ? undefined : "_blank"}
          rel={isFileResource(link) ? undefined : "noopener noreferrer"}
          key={link.id}
          onClick={(e) => handleResourceClick(e, link)}
          className="block p-6 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
              <div>
                  <h3 className="text-lg font-bold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {link.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 truncate max-w-[200px]">
                      {isFileResource(link) ? (decodeURIComponent(link.url.split('/').pop() || '')) : link.url}
                  </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${isFileResource(link) ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'}`}>
                  {isFileResource(link) ? 'ARCHIVO' : 'LINK'}
              </span>
          </div>
        </a>
      ))}
    </div>
  );
}
