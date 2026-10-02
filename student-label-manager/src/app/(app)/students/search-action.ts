"use server";

import { getUserOrNull } from "@/lib/auth-guard";
import { searchStudents } from "@/lib/students-repo";
import type { Student } from "@/types/student";

export async function searchStudentsAction(
  query: string,
  includeArchived: boolean
): Promise<Student[]> {
  const user = await getUserOrNull();
  if (!user) return [];

  return searchStudents({ query, includeArchived });
}
