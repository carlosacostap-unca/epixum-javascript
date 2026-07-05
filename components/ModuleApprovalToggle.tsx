"use client";

import { updateUserApprovedModule } from "@/lib/actions-users";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ModuleApprovalToggleProps {
  approved: boolean;
  userId: string;
  userName: string;
}

export default function ModuleApprovalToggle({
  approved,
  userId,
  userName,
}: ModuleApprovalToggleProps) {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(approved);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.checked;
    const previousValue = isApproved;

    setIsApproved(nextValue);
    setError("");

    startTransition(async () => {
      const result = await updateUserApprovedModule(userId, nextValue);

      if (!result.success) {
        setIsApproved(previousValue);
        setError(result.error || "No se pudo guardar");
        return;
      }

      router.refresh();
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={isApproved}
          onChange={handleChange}
          disabled={isPending}
          aria-label={`Marcar aprobado en modulo a ${userName}`}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span>{isApproved ? "Aprobado" : "No aprobado"}</span>
      </label>
      {error && (
        <span className="max-w-48 text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
