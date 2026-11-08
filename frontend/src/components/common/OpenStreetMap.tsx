import React from 'react';
import { MapPin } from 'lucide-react';

interface OpenStreetMapProps {
  latitude?: number | null;
  longitude?: number | null;
  title: string;
  zoom?: number;
  height?: string;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  latitude = 20.5937,
  longitude = 78.9629,
  title,
  zoom = 12,
  height = '360px',
}) => {
  const lat = latitude || 20.5937;
  const lon = longitude || 78.9629;

  // OpenStreetMap embed URL
  const bboxDelta = 0.05;
  const bbox = `${lon - bboxDelta}%2C${lat - bboxDelta}%2C${lon + bboxDelta}%2C${lat + bboxDelta}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm bg-white">
      <div className="px-4 py-3 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
        <span className="flex items-center gap-1.5 font-medium text-stone-700">
          <MapPin size={14} className="text-forest" />
          {title} ({lat.toFixed(4)}, {lon.toFixed(4)})
        </span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-forest hover:underline font-semibold"
        >
          View Larger Map ↗
        </a>
      </div>
      <iframe
        title={`Map of ${title}`}
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={embedUrl}
        className="w-full border-none"
      />
    </div>
  );
};
