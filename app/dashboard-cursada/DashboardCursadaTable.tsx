"use client";

import { useMemo, useState } from "react";
import type { Assignment, User } from "@/types";

type CourseStatus =
  | "Aprobado"
  | "Evaluacion pendiente"
  | "Entrega pendiente"
  | "Reenvio pendiente";

interface DashboardRow {
  student: User;
  statuses: {
    assignmentId: string;
    status: CourseStatus;
  }[];
  approvedCount: number;
}

interface DashboardCursadaTableProps {
  assignments: Assignment[];
  rows: DashboardRow[];
}

const statusStyles: Record<CourseStatus, string> = {
  Aprobado:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Evaluacion pendiente":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Entrega pendiente":
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "Reenvio pendiente":
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

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

export default function DashboardCursadaTable({
  assignments,
  rows,
}: DashboardCursadaTableProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const normalizedSearch = normalizeSearch(studentSearch);

  const filteredRows = useMemo(() => {
    if (!normalizedSearch) {
      return rows;
    }

    return rows.filter((row) =>
      getStudentSearchText(row.student).includes(normalizedSearch)
    );
  }, [normalizedSearch, rows]);

  return (
    <>
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <label
          htmlFor="student-search"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
        >
          Filtrar alumnos
        </label>
        <div className="relative max-w-xl">
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
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Mostrando {filteredRows.length} de {rows.length} alumnos.
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
            ) : filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={assignments.length + 2}
                  className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400"
                >
                  No hay alumnos que coincidan con la busqueda.
                </td>
              </tr>
            ) : (
              filteredRows.map(({ student, statuses, approvedCount }) => (
                <tr key={student.id}>
                  <td className="sticky left-0 z-10 bg-white dark:bg-zinc-900 px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {student.name || student.username || "Alumno sin nombre"}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {student.email}
                    </div>
                  </td>
                  {statuses.map(({ assignmentId, status }) => (
                    <td key={assignmentId} className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
                      >
                        {status}
                      </span>
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className="inline-flex min-w-10 justify-center px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold">
                      {approvedCount}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
