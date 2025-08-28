import { BaseInput } from "@/components/base/input";
import { BaseMaps } from "@/components/base/maps";
import { BaseTextarea } from "@/components/base/textarea";
import type { CustomerPayload } from "@/types/customer";
import { useEffect, type ChangeEvent } from "react";
import { Popup } from "react-leaflet";
import { useMap } from "react-leaflet";

interface CustomerFormContentProps {
  form: CustomerPayload;
  setForm: React.Dispatch<React.SetStateAction<CustomerPayload>>;
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

export const CustomerForm = ({
  form,
  setForm,
  type = "add",
}: CustomerFormContentProps) => {
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
        placeholder="Input customer name"
        label="Customer Name"
        onChange={onChange}
        name="name"
        value={form.name as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input customer store name"
        label="Customer Store Name"
        onChange={onChange}
        name="storeName"
        value={form.storeName as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="email"
        placeholder="Input customer email"
        label="Customer Email"
        onChange={onChange}
        name="email"
        value={form.email as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input customer phonenumber"
        label="Customer Phone Number"
        onChange={onChange}
        name="phoneNumber"
        value={form.phoneNumber as string}
        disabled={type == "detail"}
      />
      <BaseTextarea
        placeholder="Input customer address"
        label="Customer Address"
        onChange={onChange}
        name="address"
        value={form.address as string}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input customer latitude"
        label="Customer Latitude"
        onChange={onChange}
        name="latitude"
        value={Number(form.latitude).toFixed(6)}
        disabled={type == "detail"}
      />
      <BaseInput
        type="text"
        placeholder="Input customer longitude"
        label="Customer Longitude"
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
