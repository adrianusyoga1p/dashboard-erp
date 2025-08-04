import { BaseInput } from "@/components/base/input";
import { BaseMaps } from "@/components/base/maps";
import { BaseTextarea } from "@/components/base/textarea";
import type { ClientPayload } from "@/types/client";
import { useEffect, type ChangeEvent } from "react";
import { Popup } from "react-leaflet";
import { useMap } from "react-leaflet";

interface ClientFormContentProps {
  form: ClientPayload;
  setForm: React.Dispatch<React.SetStateAction<ClientPayload>>;
  type: "add" | "edit" | "detail";
}

const DisableInteraction = () => {
  const map = useMap();

  map.dragging.disable();
  map.scrollWheelZoom.disable();
  map.doubleClickZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  map.touchZoom.disable();
  map.zoomControl.remove();

  return null;
};

export const ClientForm = ({
  form,
  setForm,
  type = "add",
}: ClientFormContentProps) => {
  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (type === "add" && (!form.latitude || !form.longitude)) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setForm((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6).toString(),
            longitude: longitude.toFixed(6).toString(),
          }));
        },
        () => {
          setForm((prev) => ({
            ...prev,
            latitude: "-6.2",
            longitude: "106.8",
          }));
        }
      );
    }
  }, [type, setForm, form.latitude, form.longitude]);

  const isLatLngValid =
    !isNaN(parseFloat(form.latitude || "")) &&
    !isNaN(parseFloat(form.longitude || ""));

  return (
    <div className="space-y-6 p-4 relative overflow-y-auto">
      <BaseInput
        type="text"
        placeholder="Input client name"
        label="Client Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input client store name"
        label="Client Store Name"
        onChange={onChange}
        name="storeName"
        value={form.storeName as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="email"
        placeholder="Input client email"
        label="Client Email"
        onChange={onChange}
        name="email"
        value={form.email as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input client phonenumber"
        label="Client Phone Number"
        onChange={onChange}
        name="phoneNumber"
        value={form.phoneNumber as string}
        disabled={type == "detail"}
      />
      <BaseTextarea
        placeholder="Input client address"
        label="Client Address"
        onChange={onChange}
        name="address"
        value={form.address as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input client latitude"
        label="Client Latitude"
        onChange={onChange}
        name="latitude"
        value={Number(form.latitude).toFixed(6)}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input client longitude"
        label="Client Longitude"
        onChange={onChange}
        name="longitude"
        value={Number(form.longitude).toFixed(6)}
        disabled={type == "detail"}
      />
      {isLatLngValid && (
        <BaseMaps
          position={[
            parseFloat(form.latitude as string),
            parseFloat(form.longitude as string),
          ]}
          setForm={setForm}
          popUp={
            <Popup>
              {form.storeName} <br /> {form.address}
            </Popup>
          }
        >
          {type == 'detail' && <DisableInteraction />}
        </BaseMaps>
      )}
    </div>
  );
};
