import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllAssignments, getAllDeliveries, getStudents } from "@/lib/data";
import { getCurrentUser } from "@/lib/pocketbase-server";
import type { Delivery } from "@/types";
import DashboardCursadaTable from "./DashboardCursadaTable";

export const dynamic = "force-dynamic";

type CourseStatus =
  | "Aprobado"
  | "Evaluacion pendiente"
  | "Entrega pendiente"
  | "Reenvio pendiente";

function getDeliveryStatus(delivery?: Delivery): CourseStatus {
  if (!delivery) {
    return "Entrega pendiente";
  }

  if (delivery.status === "published" && delivery.verdict === "Aprobado") {
    return "Aprobado";
  }

  if (
    delivery.status === "published" &&
    (delivery.verdict === "Corregir y reenviar" ||
      delivery.verdict === "Desaprobado")
  ) {
    return "Reenvio pendiente";
  }

  return "Evaluacion pendiente";
}

export default async function DashboardCursadaPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "docente" && user.role !== "admin")) {
    redirect("/");
  }

  const [students, assignments, deliveries] = await Promise.all([
    getStudents(),
    getAllAssignments(),
    getAllDeliveries(),
  ]);

  const deliveryByStudentAndAssignment = new Map<string, Delivery>();

  for (const delivery of deliveries) {
    const key = `${delivery.student}:${delivery.assignment}`;

    if (!deliveryByStudentAndAssignment.has(key)) {
      deliveryByStudentAndAssignment.set(key, delivery);
    }
  }

  const rows = students.map((student) => {
    const statuses = assignments.map((assignment) => {
      const delivery = deliveryByStudentAndAssignment.get(
        `${student.id}:${assignment.id}`
      );

      return {
        assignmentId: assignment.id,
        status: getDeliveryStatus(delivery),
      };
    });

    return {
      student,
      statuses,
      approvedCount: statuses.filter((item) => item.status === "Aprobado")
        .length,
    };
  });

  const statusTotals = rows.reduce(
    (totals, row) => {
      for (const item of row.statuses) {
        totals[item.status] += 1;
      }

      return totals;
    },
    {
      Aprobado: 0,
      "Evaluacion pendiente": 0,
      "Entrega pendiente": 0,
      "Reenvio pendiente": 0,
    } as Record<CourseStatus, number>
  );

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
        &larr; Volver al panel
      </Link>

      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Dashboard Cursada
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Estado de cada trabajo practico por alumno.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {students.length}
            </div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Alumnos
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {assignments.length}
            </div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Trabajos
            </div>
          </div>
          {(Object.keys(statusTotals) as CourseStatus[]).map((status) => (
            <div
              key={status}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3"
            >
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {statusTotals[status]}
              </div>
              <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Seguimiento por alumno
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            La evaluacion pendiente indica una entrega enviada sin devolucion publicada.
          </p>
        </div>

        <DashboardCursadaTable assignments={assignments} rows={rows} />
      </div>
    </div>
  );
}
