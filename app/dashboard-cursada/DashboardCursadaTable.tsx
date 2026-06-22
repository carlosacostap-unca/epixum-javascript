"use client";

import { Fragment, useMemo, useState } from "react";
import type { Assignment, User } from "@/types";

type CourseStatus =
  | "Aprobado"
  | "Desaprobado"
  | "Evaluacion pendiente"
  | "Entrega pendiente"
  | "Reenvio pendiente";
type StudentCourseState = "OK" | "Fuera de carrera" | "Complicado";
type ViewMode = "all" | "by-state" | "review";

interface DashboardRow {
  student: User;
  statuses: {
    assignmentId: string;
    status: CourseStatus;
  }[];
  approvedCount: number;
  courseState: StudentCourseState;
}

interface DashboardCursadaTableProps {
  assignments: Assignment[];
  rows: DashboardRow[];
}

const statusStyles: Record<CourseStatus, string> = {
  Aprobado:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Desaprobado:
    "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300",
  "Evaluacion pendiente":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Entrega pendiente":
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "Reenvio pendiente":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};
const courseStateStyles: Record<StudentCourseState, string> = {
  OK: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Fuera de carrera":
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
  Complicado:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};
const stateOrder: StudentCourseState[] = ["OK", "Complicado", "Fuera de carrera"];

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getStudentSearchText(student: User) {
  return normalizeSearch(
    [
      student.name,
      student.firstName,
      student.lastName,
      `${student.firstName || ""} ${student.lastName || ""}`,
      student.username,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function needsReview(row: DashboardRow, assignmentCount: number) {
  if (assignmentCount === 0) {
    return false;
  }

  const hasEveryAssignmentApproved = row.approvedCount === assignmentCount;
  const hasNoDeliveries = row.statuses.every(
    (item) => item.status === "Entrega pendiente"
  );

  return !hasEveryAssignmentApproved && !hasNoDeliveries;
}

export default function DashboardCursadaTable({
  assignments,
  rows,
}: DashboardCursadaTableProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const normalizedSearch = normalizeSearch(studentSearch);

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      getStudentSearchText(row.student).includes(normalizedSearch)
    );
  }, [normalizedSearch, rows]);
  const groupedRows = useMemo(
    () =>
      stateOrder.map((state) => ({
        state,
        rows: filteredRows.filter((row) => row.courseState === state),
      })),
    [filteredRows]
  );
  const reviewRows = useMemo(
    () => filteredRows.filter((row) => needsReview(row, assignments.length)),
    [assignments.length, filteredRows]
  );
  const visibleRows =
    viewMode === "all"
      ? filteredRows
      : viewMode === "review"
        ? reviewRows
        : groupedRows.flatMap((group) => group.rows);

  return (
    <>
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="w-full max-w-xl">
            <label
              htmlFor="student-search"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Filtrar alumnos
            </label>
            <div className="relative">
              <input
                id="student-search"
                type="search"
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="Buscar por nombre o apellido..."
                className="w-full px-3 py-2 pl-10 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Vista
            </div>
            <div
              className="inline-flex rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-950 p-1"
              role="group"
              aria-label="Modo de visualizacion"
            >
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "all"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setViewMode("by-state")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "by-state"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Por estado
              </button>
              <button
                type="button"
                onClick={() => setViewMode("review")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "review"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                Revisión
              </button>
            </div>
          </div>
        </div>

        {viewMode === "by-state" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {stateOrder.map((state) => (
              <span
                key={state}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${courseStateStyles[state]}`}
              >
                {state}
                <span>{groupedRows.find((group) => group.state === state)?.rows.length || 0}</span>
              </span>
            ))}
          </div>
        )}

        {viewMode === "review" && (
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              Necesitan revision
              <span>{reviewRows.length}</span>
            </span>
          </div>
        )}

        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Mostrando {visibleRows.length} de {rows.length} alumnos.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="sticky left-0 z-10 bg-zinc-50 dark:bg-zinc-800 px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                Alumno
              </th>
              {assignments.map((assignment) => (
                <th
                  key={assignment.id}
                  className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider min-w-44"
                >
                  <span className="line-clamp-2" title={assignment.title}>
                    {assignment.title}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                Aprobados
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={assignments.length + 2}
                  className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No hay alumnos registrados.
                </td>
              </tr>
            ) : assignments.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No hay trabajos practicos registrados.
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={assignments.length + 2}
                  className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  {viewMode === "review"
                    ? "No hay alumnos que necesiten revision."
                    : "No hay alumnos que coincidan con la busqueda."}
                </td>
              </tr>
            ) : viewMode === "by-state" ? (
              groupedRows.map((group) => (
                <Fragment key={group.state}>
                  <tr>
                    <td
                      colSpan={assignments.length + 2}
                      className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${courseStateStyles[group.state]}`}
                      >
                        {group.state}
                        <span>{group.rows.length}</span>
                      </span>
                    </td>
                  </tr>
                  {group.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={assignments.length + 2}
                        className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400"
                      >
                        No hay alumnos en este estado.
                      </td>
                    </tr>
                  ) : (
                    group.rows.map((row) => (
                      <StudentRow
                        key={row.student.id}
                        assignments={assignments}
                        row={row}
                      />
                    ))
                  )}
                </Fragment>
              ))
            ) : (
              visibleRows.map((row) => (
                <StudentRow
                  key={row.student.id}
                  assignments={assignments}
                  row={row}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StudentRow({
  assignments,
  row,
}: {
  assignments: Assignment[];
  row: DashboardRow;
}) {
  const { student, statuses, approvedCount, courseState } = row;

  return (
    <tr>
      <td className="sticky left-0 z-10 bg-white dark:bg-zinc-900 px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="font-medium text-zinc-900 dark:text-zinc-100">
            {student.name || student.username || "Alumno sin nombre"}
          </div>
          <span
            className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${courseStateStyles[courseState]}`}
          >
            {courseState}
          </span>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {student.email}
        </div>
      </td>
      {assignments.map((assignment) => {
        const status =
          statuses.find((item) => item.assignmentId === assignment.id)?.status ||
          "Entrega pendiente";

        return (
          <td key={assignment.id} className="px-4 py-4">
            <span
              className={`inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          </td>
        );
      })}
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <span className="inline-flex min-w-10 justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold">
          {approvedCount}
        </span>
      </td>
    </tr>
  );
}
