"use server";

import { getUserOrNull } from "@/lib/auth-guard";
import { findDuplicates } from "@/lib/students-repo";

export interface DuplicateCandidate {
  id: string;
  full_name: string;
  school_name: string;
  status: string;
}

export async function checkDuplicateAction(
  fullName: string,
  schoolName: string,
  excludeId?: string
): Promise<DuplicateCandidate[]> {
  const user = await getUserOrNull();
  if (!user) return [];

  const matches = await findDuplicates(fullName, schoolName, excludeId);
  return matches.map((m) => ({
    id: m.id,
    full_name: m.full_name,
    school_name: m.school_name,
    status: m.status,
  }));
}
