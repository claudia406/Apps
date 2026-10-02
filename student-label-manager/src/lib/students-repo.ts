import { createClient } from "@/lib/supabase/server";
import type { Student, StudentStatus } from "@/types/student";
import type { StudentInput } from "@/lib/validation";

function dbColumns(input: StudentInput) {
  return {
    full_name: input.fullName,
    furigana: input.furigana,
    postal_code: input.postalCode,
    address: input.address,
    school_name: input.schoolName,
    phone: input.phone,
    email: input.email,
    guardian_name: input.guardianName,
  };
}

/** ILIKE の特殊文字(% _ \)をエスケープする */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/**
 * PostgREST の .or() フィルタ文字列は , や ( ) を区切り文字として解釈するため、
 * 検索語にこれらの文字が含まれていても安全に渡せるよう値全体をダブルクォートで囲む。
 */
function toOrFilterValue(likePattern: string): string {
  return `"${likePattern.replace(/"/g, '\\"')}"`;
}

export interface SearchParams {
  query: string;
  includeArchived: boolean;
}

export async function searchStudents({ query, includeArchived }: SearchParams): Promise<Student[]> {
  const supabase = await createClient();
  let builder = supabase
    .from("students")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (!includeArchived) {
    builder = builder.eq("status", "active");
  }

  const trimmed = query.trim();
  if (trimmed) {
    const like = toOrFilterValue(`%${escapeLike(trimmed)}%`);
    builder = builder.or(
      `full_name.ilike.${like},furigana.ilike.${like},school_name.ilike.${like},email.ilike.${like}`
    );
  }

  const { data, error } = await builder;
  if (error) throw error;
  return data ?? [];
}

export async function getStudentById(id: string): Promise<Student | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getStudentsByIds(ids: string[]): Promise<Student[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("students").select("*").in("id", ids);
  if (error) throw error;
  return data ?? [];
}

export async function findDuplicates(
  fullName: string,
  schoolName: string,
  excludeId?: string
): Promise<Student[]> {
  if (!fullName.trim() || !schoolName.trim()) return [];

  const supabase = await createClient();
  let builder = supabase
    .from("students")
    .select("*")
    .is("deleted_at", null)
    .eq("full_name", fullName.trim())
    .eq("school_name", schoolName.trim());

  if (excludeId) {
    builder = builder.neq("id", excludeId);
  }

  const { data, error } = await builder;
  if (error) throw error;
  return data ?? [];
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(dbColumns(input))
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateStudent(id: string, input: StudentInput): Promise<Student> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .update(dbColumns(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function setStudentStatus(id: string, status: StudentStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("students").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function softDeleteStudent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function restoreStudent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("students").update({ deleted_at: null }).eq("id", id);
  if (error) throw error;
}

export async function permanentlyDeleteStudent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}

export async function listTrash(): Promise<Student[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function recordRecentView(studentId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("recent_views")
    .upsert({ student_id: studentId, viewed_at: new Date().toISOString() });
}

export interface RecentViewEntry {
  student_id: string;
  viewed_at: string;
  student: Pick<Student, "id" | "full_name" | "school_name" | "status" | "deleted_at"> | null;
}

export async function listRecentViews(limit = 6): Promise<RecentViewEntry[]> {
  const supabase = await createClient();
  // 削除済みの生徒を除外した上で件数を確保するため、少し多めに取得してからフィルタする
  const { data, error } = await supabase
    .from("recent_views")
    .select("student_id, viewed_at, student:students(id, full_name, school_name, status, deleted_at)")
    .order("viewed_at", { ascending: false })
    .limit(limit * 3);
  if (error) throw error;

  const rows = (data ?? []) as unknown as RecentViewEntry[];
  return rows.filter((row) => row.student && row.student.deleted_at === null).slice(0, limit);
}
