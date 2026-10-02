"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-guard";
import { setStudentStatus, softDeleteStudent } from "@/lib/students-repo";

export async function archiveAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await setStudentStatus(id, "archived");
  revalidatePath(`/students/${id}`);
}

export async function unarchiveAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await setStudentStatus(id, "active");
  revalidatePath(`/students/${id}`);
}

export async function deleteToTrashAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await softDeleteStudent(id);
  redirect("/students");
}
