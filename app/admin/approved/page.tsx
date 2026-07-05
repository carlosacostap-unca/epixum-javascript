import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllAssignments, getAllDeliveries, getStudents } from "@/lib/data";
import { buildCourseDashboard, type CourseStatus } from "@/lib/course-dashboard";
import { getCurrentUser } from "@/lib/pocketbase-server";
import DashboardCursadaTable from "@/app/dashboard-cursada/DashboardCursadaTable";

export const dynamic = "force-dynamic";

export default async function ManageApprovedPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const [students, assignments, deliveries] = await Promise.all([
    getStudents(),
    getAllAssignments(),
    getAllDeliveries(),
  ]);
  const { rows, sortedAssignments, statusTotals } = buildCourseDashboard(
    students,
    assignments,
    deliveries
  );
  const approvedModuleCount = students.filter(
    (student) => student.approvedModule
  ).length;

  return (
    <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
        &larr; Volver al panel
      </Link>

      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Gestionar Aprobados
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Controla el estado de cursada y marca que alumnos aprobaron el
            modulo.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-8 gap-3">
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
              {sortedAssignments.length}
            </div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Trabajos
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {approvedModuleCount}
            </div>
            <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Aprobados modulo
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
            Seguimiento y aprobacion del modulo
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            El ultimo campo guarda en la base si el alumno esta aprobado en el
            modulo.
          </p>
        </div>

        <DashboardCursadaTable
          assignments={sortedAssignments}
          rows={rows}
          showModuleApprovalColumn
        />
      </div>
    </div>
  );
}
