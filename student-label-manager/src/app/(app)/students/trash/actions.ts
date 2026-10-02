"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { restoreStudent, permanentlyDeleteStudent } from "@/lib/students-repo";

export async function restoreAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await restoreStudent(id);
  revalidatePath("/students/trash");
}

export async function permanentDeleteAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await permanentlyDeleteStudent(id);
  revalidatePath("/students/trash");
}
