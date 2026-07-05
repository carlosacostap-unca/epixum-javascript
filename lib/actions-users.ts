"use server";

import { createServerClient } from "@/lib/pocketbase-server";
import { revalidatePath, revalidateTag } from "next/cache";

interface UserProfileData {
  firstName?: string;
  lastName?: string;
  dni?: string;
  birthDate?: string;
  phone?: string;
}

type UserBooleanField = "approvedModule" | "recommendation";

const userBooleanFieldLabels: Record<UserBooleanField, string> = {
  approvedModule: "aprobado del modulo",
  recommendation: "recomendacion",
};

function getPocketBaseErrorMessage(error: any, field: UserBooleanField) {
  const fieldError = error?.response?.data?.[field]?.message;

  if (fieldError) {
    return fieldError;
  }

  return (
    error?.message ||
    `Error al actualizar ${userBooleanFieldLabels[field]}`
  );
}

export async function updateUserProfile(userId: string, data: UserProfileData) {
  const pb = await createServerClient();
  const currentUser = pb.authStore.model;

  if (!currentUser) {
    return { success: false, error: "No autorizado" };
  }

  // Allow users to update their own profile, or admins to update anyone
  if (currentUser.id !== userId && currentUser.role !== 'admin') {
    return { success: false, error: "No autorizado para editar este perfil" };
  }

  try {
    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      dni: data.dni,
      phone: data.phone,
    };

    // Handle birthDate
    if (data.birthDate) {
      // Input type="date" returns YYYY-MM-DD
      // PocketBase expects a date string or ISO string
      updateData.birthDate = new Date(data.birthDate).toISOString();
    } else if (data.birthDate === "") {
        updateData.birthDate = null;
    }

    // Auto-update 'name' field if both firstName and lastName are present
    if (data.firstName && data.lastName) {
      updateData.name = `${data.firstName} ${data.lastName}`;
    }

    // Filter out undefined values to avoid overwriting with empty if not intended (though form usually sends everything)
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    await pb.collection("users").update(userId, updateData);
    
    revalidatePath("/profile");
    revalidatePath("/"); // Update globally if user info is in header
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error?.message || "Error al actualizar perfil" };
  }
}

export async function updateUserApprovedModule(userId: string, approvedModule: boolean) {
  return updateUserBooleanField(userId, "approvedModule", approvedModule);
}

export async function updateUserRecommendation(userId: string, recommendation: boolean) {
  return updateUserBooleanField(userId, "recommendation", recommendation);
}

async function updateUserBooleanField(
  userId: string,
  field: UserBooleanField,
  value: boolean
) {
  const pb = await createServerClient();
  const currentUser = pb.authStore.model;

  if (!currentUser || currentUser.role !== "admin") {
    return { success: false, error: "No autorizado" };
  }

  try {
    await pb.collection("users").update(userId, { [field]: value });
    const savedUser = await pb.collection("users").getOne(userId);

    if (!Object.prototype.hasOwnProperty.call(savedUser, field)) {
      return {
        success: false,
        error:
          `No se pudo guardar: falta el campo users.${field} en PocketBase. Crea el campo booleano ${field} en la coleccion users.`,
      };
    }

    if (savedUser[field] !== value) {
      return {
        success: false,
        error:
          `PocketBase respondio correctamente, pero el valor ${field} no quedo persistido.`,
      };
    }

    revalidateTag("users", "max");
    revalidatePath("/admin/approved");
    revalidatePath("/dashboard-cursada");

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating user boolean field ${field}:`, error);
    return {
      success: false,
      error: getPocketBaseErrorMessage(error, field),
    };
  }
}
