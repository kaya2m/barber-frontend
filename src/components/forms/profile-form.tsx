"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      await updateProfile(data);
      toast.success("Profil başarıyla güncellendi!");
    } catch (error: any) {
      toast.error(error.message || "Profil güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("firstName", { required: "Ad gerekli" })}
          label="Ad"
          placeholder="Adınız"
          error={errors.firstName?.message}
        />
        <Input
          {...register("lastName", { required: "Soyad gerekli" })}
          label="Soyad"
          placeholder="Soyadınız"
          error={errors.lastName?.message}
        />
      </div>

      <div>
        <Input
          {...register("email", { required: "Email gerekli" })}
          type="email"
          label="Email"
          placeholder="ornek@email.com"
          error={errors.email?.message}
        />
      </div>

      <div>
        <Input
          {...register("phoneNumber", { required: "Telefon gerekli" })}
          type="tel"
          label="Telefon"
          placeholder="+90 555 123 45 67"
          error={errors.phoneNumber?.message}
        />
      </div>

      <Button
        type="submit"
        loading={loading}
        disabled={!isDirty}
        className="w-full"
      >
        Profili Güncelle
      </Button>
    </form>
  );
}
