import { useEffect, type ReactNode } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  type MapContainerProps,
} from "react-leaflet";
import type { ClientPayload } from "@/types/client";

interface BaseMapsProps extends MapContainerProps {
  setForm: React.Dispatch<React.SetStateAction<ClientPayload>>;
  position: [number, number];
  popUp?: ReactNode;
}

function LocationPicker({
  setForm,
}: {
  setForm: React.Dispatch<React.SetStateAction<ClientPayload>>;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setForm((prev) => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString(),
      }));
    },
  });
  return null;
}

function CustomWheelZoomControl() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const handleWheel = (e: WheelEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const zoomAllowed = isMac ? e.metaKey : e.ctrlKey;

      if (zoomAllowed) {
        e.preventDefault();
        map.scrollWheelZoom.enable();
        map.fire("wheel", e);
        setTimeout(() => {
          map.scrollWheelZoom.disable();
        }, 100);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
}

const BaseMaps = ({
  setForm,
  position,
  popUp,
  children,
  ...props
}: BaseMapsProps) => {
  return (
    <MapContainer
      attributionControl={false}
      center={position}
      zoom={20}
      style={{ height: "300px" }}
      scrollWheelZoom={false}
      {...props}
    >
      <TileLayer url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <LocationPicker setForm={setForm} />
      <CustomWheelZoomControl />
      <Marker position={position}>{popUp}</Marker>
      {children}
    </MapContainer>
  );
};

export { BaseMaps };
