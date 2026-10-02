import { listTrash } from "@/lib/students-repo";
import { restoreAction, permanentDeleteAction } from "./actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function TrashPage() {
  const trashed = await listTrash();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>ゴミ箱</h1>
      <div className="card">
        {trashed.length === 0 ? (
          <p className="help-text">ゴミ箱は空です。</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>氏名</th>
                <th>学校名</th>
                <th>削除日時</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {trashed.map((s) => (
                <tr key={s.id}>
                  <td>{s.full_name || "(未入力)"}</td>
                  <td>{s.school_name || "-"}</td>
                  <td>{formatDateTime(s.deleted_at!)}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <form action={restoreAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="btn">
                        復元
                      </button>
                    </form>
                    <form action={permanentDeleteAction}>
                      <input type="hidden" name="id" value={s.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`${
                          s.full_name || "この生徒"
                        }を完全に削除します。この操作は取り消せません。よろしいですか？`}
                        className="btn btn-danger"
                      >
                        完全に削除
                      </ConfirmSubmitButton>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
