import StudentForm from "@/components/StudentForm";
import { createStudentAction } from "./actions";

export default function NewStudentPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>新規生徒登録</h1>
      <StudentForm
        action={createStudentAction}
        initialValues={{
          fullName: "",
          postalCode: "",
          address: "",
          schoolName: "",
          phone: "",
          email: "",
          guardianName: "",
        }}
        submitLabel="登録する"
        cancelHref="/students"
      />
    </div>
  );
}
