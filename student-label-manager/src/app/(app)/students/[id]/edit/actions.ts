"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-guard";
import { studentSchema } from "@/lib/validation";
import { updateStudent } from "@/lib/students-repo";

export interface StudentFormState {
  error: string | null;
  values: Record<string, string>;
}

export async function updateStudentAction(
  id: string,
  _prev: StudentFormState,
  formData: FormData
): Promise<StudentFormState> {
  await requireUser();

  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    furigana: String(formData.get("furigana") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    address: String(formData.get("address") ?? ""),
    schoolName: String(formData.get("schoolName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    guardianName: String(formData.get("guardianName") ?? ""),
  };

  const parsed = studentSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "入力内容を確認してください。",
      values: raw,
    };
  }

  await updateStudent(id, parsed.data);
  redirect(`/students/${id}`);
}
