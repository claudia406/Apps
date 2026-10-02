export type StudentStatus = "active" | "archived";

export interface Student {
  id: string;
  full_name: string;
  furigana: string;
  postal_code: string;
  address: string;
  school_name: string;
  phone: string;
  email: string;
  guardian_name: string;
  status: StudentStatus;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecentView {
  student_id: string;
  viewed_at: string;
  students: Pick<Student, "id" | "full_name" | "school_name"> | null;
}
