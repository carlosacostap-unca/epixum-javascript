import type { Assignment, Delivery, User } from "@/types";

export type CourseStatus =
  | "Aprobado"
  | "Desaprobado"
  | "Evaluacion pendiente"
  | "Entrega pendiente"
  | "Reenvio pendiente";
export type StudentCourseState = "OK" | "Fuera de carrera" | "Complicado";

export interface DashboardRow {
  student: User;
  statuses: {
    assignmentId: string;
    status: CourseStatus;
    isLateDelivery?: boolean;
  }[];
  approvedCount: number;
  courseState: StudentCourseState;
}

function getDeliveryStatus(delivery?: Delivery): CourseStatus {
  if (!delivery) {
    return "Entrega pendiente";
  }

  if (delivery.status === "published" && delivery.verdict === "Aprobado") {
    return "Aprobado";
  }

  if (
    delivery.status === "published" &&
    delivery.verdict === "Corregir y reenviar"
  ) {
    return "Reenvio pendiente";
  }

  if (delivery.status === "published" && delivery.verdict === "Desaprobado") {
    return "Desaprobado";
  }

  return "Evaluacion pendiente";
}

function getAssignmentNumber(assignment: Assignment) {
  const match = assignment.title.match(/\d+/g);

  if (!match) {
    return Number.MAX_SAFE_INTEGER;
  }

  return Number(match[match.length - 1]);
}

function getStudentCourseState(
  statuses: { status: CourseStatus }[]
): StudentCourseState {
  const approvedCount = statuses.filter((item) => item.status === "Aprobado")
    .length;
  const hasAssignments = statuses.length > 0;
  const hasOnlyPendingDeliveries =
    hasAssignments &&
    statuses.every((item) => item.status === "Entrega pendiente");

  if (approvedCount >= 3) {
    return "OK";
  }

  if (hasOnlyPendingDeliveries) {
    return "Fuera de carrera";
  }

  return "Complicado";
}

function getStudentDisplayName(student: {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
}) {
  return (
    student.name ||
    `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
    student.email ||
    student.username ||
    ""
  );
}

export function buildCourseDashboard(
  students: User[],
  assignments: Assignment[],
  deliveries: Delivery[]
) {
  const sortedAssignments = [...assignments].sort((first, second) => {
    const numberDiff = getAssignmentNumber(first) - getAssignmentNumber(second);

    if (numberDiff !== 0) {
      return numberDiff;
    }

    return first.title.localeCompare(second.title);
  });

  const deliveryByStudentAndAssignment = new Map<string, Delivery>();

  for (const delivery of deliveries) {
    const key = `${delivery.student}:${delivery.assignment}`;

    if (!deliveryByStudentAndAssignment.has(key)) {
      deliveryByStudentAndAssignment.set(key, delivery);
    }
  }

  const rows = students
    .map((student) => {
      const statuses = sortedAssignments.map((assignment) => {
        const delivery = deliveryByStudentAndAssignment.get(
          `${student.id}:${assignment.id}`
        );
        const isLateDelivery = !!(
          delivery?.created &&
          assignment.dueDate &&
          new Date(delivery.created) > new Date(assignment.dueDate)
        );

        return {
          assignmentId: assignment.id,
          status: getDeliveryStatus(delivery),
          isLateDelivery,
        };
      });

      const approvedCount = statuses.filter((item) => item.status === "Aprobado")
        .length;

      return {
        student,
        statuses,
        approvedCount,
        courseState: getStudentCourseState(statuses),
      };
    })
    .sort((first, second) =>
      getStudentDisplayName(first.student).localeCompare(
        getStudentDisplayName(second.student),
        "es",
        { sensitivity: "base" }
      )
    );

  const statusTotals = rows.reduce(
    (totals, row) => {
      for (const item of row.statuses) {
        totals[item.status] += 1;
      }

      return totals;
    },
    {
      Aprobado: 0,
      Desaprobado: 0,
      "Evaluacion pendiente": 0,
      "Entrega pendiente": 0,
      "Reenvio pendiente": 0,
    } as Record<CourseStatus, number>
  );

  return { rows, sortedAssignments, statusTotals };
}
