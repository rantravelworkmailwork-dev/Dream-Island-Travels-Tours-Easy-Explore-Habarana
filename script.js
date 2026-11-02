document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("sri-lanka-map");
  if (!mapElement) return;

  const map = L.map("sri-lanka-map", {
    scrollWheelZoom: false
  }).setView([7.5, 80.5], 8);

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom'
  }).addTo(map);

  // Geographic waypoints (Unique physical locations)
  const routeStops = [
    {
      step: 1,
      day: "Day 1 & Day 4",
      title: "Colombo",
      stay: "Start & End Point",
      coords: [6.9271, 79.8612],
      desc: "Pick-up on Day 1 and final drop-off on Day 4."
    },
    {
      step: 2,
      day: "Transit Route",
      title: "Nikaweratiya",
      stay: "En Route Stop",
      coords: [8.1528, 80.1169],
      desc: "Scenic transit route connecting Colombo and Habarana."
    },
    {
      step: 3,
      day: "Days 1 – 3",
      title: "Habarana & Sigiriya Region",
      stay: "Amaya Lake Hotel (3 Nights, HB)",
      coords: [8.0339, 80.7533],
      desc: "Base for Sigiriya, Dambulla Cave Temple, Safari & Cultural experiences."
    }
  ];

  // Draw clear outward & return route loop
  const pathCoords = [
    [6.9271, 79.8612], // 1. Colombo
    [8.1528, 80.1169], // 2. Nikaweratiya
    [8.0339, 80.7533], // 3. Habarana / Amaya Lake
    [8.1528, 80.1169], // Return via Nikaweratiya
    [6.9271, 79.8612]  // Return to Colombo
  ];

  // Render unique pin markers (1, 2, 3)
  routeStops.forEach((stop) => {
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<span>${stop.step}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; max-width: 220px;">
        <span style="background:#0284c7; color:white; font-size:11px; font-weight:bold; padding:2px 8px; border-radius:10px;">${stop.day}</span>
        <h6 style="margin: 6px 0 2px 0; font-weight:800; color:#0f172a; font-size: 14px;">${stop.title}</h6>
        <p style="font-size:12px; margin:0; color:#334155;"><strong>Note:</strong> ${stop.stay}</p>
        <p style="font-size:12px; margin-top:4px; color:#1e293b; line-height: 1.4;">${stop.desc}</p>
      </div>
    `;

    L.marker(stop.coords, { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);
  });

  // Polyline connects Colombo -> Nikaweratiya -> Habarana -> Nikaweratiya -> Colombo
  const polyline = L.polyline(pathCoords, {
    color: '#a8843f',
    weight: 4,
    opacity: 0.9,
    dashArray: '6, 8'
  }).addTo(map);

  const fitMapBounds = () => {
    const isMobile = window.innerWidth < 768;
    const paddingVal = isMobile ? [20, 20] : [40, 40];
    map.fitBounds(polyline.getBounds(), { padding: paddingVal });
  };

  fitMapBounds();

  window.addEventListener('resize', () => {
    map.invalidateSize();
    fitMapBounds();
  });
});