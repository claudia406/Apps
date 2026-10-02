import { notFound } from "next/navigation";
import StudentForm from "@/components/StudentForm";
import { getStudentById } from "@/lib/students-repo";
import { updateStudentAction } from "./actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: Props) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student || student.deleted_at) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>生徒情報編集</h1>
      <StudentForm
        action={updateStudentAction.bind(null, student.id)}
        initialValues={{
          fullName: student.full_name,
          furigana: student.furigana,
          postalCode: student.postal_code,
          address: student.address,
          schoolName: student.school_name,
          phone: student.phone,
          email: student.email,
          guardianName: student.guardian_name,
        }}
        excludeId={student.id}
        submitLabel="保存する"
        cancelHref={`/students/${student.id}`}
      />
    </div>
  );
}
