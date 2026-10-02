import { notFound } from "next/navigation";
import Link from "next/link";
import { getStudentById, recordRecentView } from "@/lib/students-repo";
import { archiveAction, unarchiveAction, deleteToTrashAction } from "./actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

interface Props {
  params: Promise<{ id: string }>;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;
  const student = await getStudentById(id);

  if (!student || student.deleted_at) {
    notFound();
  }

  await recordRecentView(student.id);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", display: "grid", gap: 16 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 20 }}>{student.full_name || "(氏名未入力)"}</h1>
            <span
              className={`status-badge ${
                student.status === "archived" ? "status-archived" : "status-active"
              }`}
            >
              {student.status === "archived" ? "アーカイブ" : "現役"}
            </span>
          </div>
          <Link href={`/students/${student.id}/edit`} className="btn">
            編集
          </Link>
        </div>

        <dl style={{ marginTop: 20 }}>
          {[
            ["学校名", student.school_name],
            ["郵便番号", student.postal_code],
            ["住所", student.address],
            ["電話番号", student.phone],
            ["メールアドレス", student.email],
            ["保護者名", student.guardian_name],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", padding: "6px 0", borderBottom: "1px solid var(--color-border)" }}>
              <dt style={{ width: 140, color: "var(--color-text-muted)" }}>{label}</dt>
              <dd style={{ margin: 0, whiteSpace: "pre-wrap" }}>{value || "-"}</dd>
            </div>
          ))}
        </dl>

        <p className="help-text" style={{ marginTop: 12 }}>
          登録日時: {formatDateTime(student.created_at)} ／ 最終更新: {formatDateTime(student.updated_at)}
        </p>
      </div>

      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href={`/print?ids=${student.id}`} className="btn btn-primary">
          ラベル印刷
        </Link>

        {student.status === "active" ? (
          <form action={archiveAction}>
            <input type="hidden" name="id" value={student.id} />
            <button type="submit" className="btn">
              アーカイブする
            </button>
          </form>
        ) : (
          <form action={unarchiveAction}>
            <input type="hidden" name="id" value={student.id} />
            <button type="submit" className="btn">
              現役に戻す
            </button>
          </form>
        )}

        <form action={deleteToTrashAction}>
          <input type="hidden" name="id" value={student.id} />
          <ConfirmSubmitButton
            confirmMessage={`${student.full_name || "この生徒"}をゴミ箱に移動します。よろしいですか？`}
            className="btn btn-danger"
          >
            削除（ゴミ箱へ）
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
