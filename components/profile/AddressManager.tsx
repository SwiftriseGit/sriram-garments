"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, MapPin, Trash2, CheckCircle2, Home, Building2, Briefcase, X, Loader2 } from "lucide-react";
import { saveAddress, deleteAddress, setDefaultAddress } from "@/actions/addresses";

interface AddressItem {
  _id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormData {
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export function AddressManager({ initialAddresses }: { initialAddresses: AddressItem[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      label: "Home",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    },
  });

  const openAddForm = () => {
    setEditingAddress(null);
    reset({
      label: "Home",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: initialAddresses.length === 0,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (addr: AddressItem) => {
    setEditingAddress(addr);
    reset({
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    if (editingAddress) {
      formData.set("addressId", editingAddress._id);
    }
    formData.set("label", data.label);
    formData.set("line1", data.line1);
    if (data.line2) formData.set("line2", data.line2);
    formData.set("city", data.city);
    formData.set("state", data.state);
    formData.set("pincode", data.pincode);
    if (data.isDefault) formData.set("isDefault", "true");

    const result = await saveAddress(formData);
    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
    } else {
      setIsFormOpen(false);
      reset();
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    const formData = new FormData();
    formData.set("addressId", addressId);
    await deleteAddress(formData);
  };

  const handleSetDefault = async (addressId: string) => {
    const formData = new FormData();
    formData.set("addressId", addressId);
    await setDefaultAddress(formData);
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home":
        return <Home className="w-4 h-4 text-orange-500" />;
      case "office":
      case "work":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      default:
        return <Building2 className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Saved Addresses</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            Manage your delivery and billing locations
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Address Form (Modal / Card) */}
      {isFormOpen && (
        <div className="bg-white border-2 border-orange-500/30 rounded-2xl p-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
            <h3 className="font-bold text-lg text-zinc-900">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Label selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                Address Type
              </label>
              <div className="flex gap-3">
                {["Home", "Work", "Other"].map((type) => (
                  <label
                    key={type}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 border rounded-xl text-sm font-medium cursor-pointer transition-colors border-zinc-200 hover:bg-zinc-50 has-checked:border-orange-500 has-checked:bg-orange-50/60 has-checked:text-orange-600"
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("label")}
                      className="sr-only"
                    />
                    {getLabelIcon(type)}
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Line 1 */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Street Address / Flat / Building *
              </label>
              <input
                type="text"
                placeholder="Flat 402, Sunshine Heights, MG Road"
                {...register("line1", { required: "Address line 1 is required" })}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              {errors.line1 && (
                <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>
              )}
            </div>

            {/* Line 2 */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Area / Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="Near Metro Station"
                {...register("line2")}
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  placeholder="Bangalore"
                  {...register("city", { required: "City is required" })}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  placeholder="Karnataka"
                  {...register("state", { required: "State is required" })}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  placeholder="560001"
                  maxLength={6}
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: { value: /^[0-9]{6}$/, message: "Valid 6-digit pincode required" },
                  })}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            {/* Default toggle */}
            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("isDefault")}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-700">
                Set as default delivery address
              </span>
            </label>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {initialAddresses.length === 0 && !isFormOpen ? (
        <div className="min-h-[35vh] bg-white border border-dashed border-zinc-300 rounded-2xl flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-orange-500">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-lg">No addresses saved yet</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Add an address so you can checkout faster on your next order.
              </p>
            </div>
            <button
              onClick={openAddForm}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Your First Address
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {initialAddresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all ${
                addr.isDefault
                  ? "border-orange-500/70 shadow-sm ring-1 ring-orange-500/20"
                  : "border-zinc-200/70 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
                    {getLabelIcon(addr.label)}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-900 text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(addr)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 p-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-zinc-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-zinc-600 space-y-0.5 leading-relaxed">
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} - <span className="font-medium text-zinc-900">{addr.pincode}</span>
                </p>
              </div>

              {!addr.isDefault && (
                <div className="mt-4 pt-3 border-t border-zinc-100">
                  <button
                    onClick={() => handleSetDefault(addr._id)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    Set as Default Address
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
