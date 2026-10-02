"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { formatPostalCode, formatPhoneNumber } from "@/lib/format";
import { checkDuplicateAction, type DuplicateCandidate } from "@/app/(app)/students/duplicate-action";
import { lookupPostalCodeAction } from "@/app/(app)/students/zipcode-action";

export interface StudentFormValues {
  fullName: string;
  postalCode: string;
  address: string;
  schoolName: string;
  phone: string;
  email: string;
  guardianName: string;
}

export interface StudentFormState {
  error: string | null;
  values: Record<string, string>;
}

type StudentFormAction = (prev: StudentFormState, formData: FormData) => Promise<StudentFormState>;

interface Props {
  action: StudentFormAction;
  initialValues: StudentFormValues;
  excludeId?: string;
  submitLabel: string;
  cancelHref: string;
}

export default function StudentForm({ action, initialValues, excludeId, submitLabel, cancelHref }: Props) {
  const [state, formAction, isPending] = useActionState(action, { error: null, values: {} });

  const [fullName, setFullName] = useState(initialValues.fullName);
  const [postalCode, setPostalCode] = useState(initialValues.postalCode);
  const [address, setAddress] = useState(initialValues.address);
  const [schoolName, setSchoolName] = useState(initialValues.schoolName);
  const [phone, setPhone] = useState(initialValues.phone);

  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [, startDuplicateCheck] = useTransition();

  function runDuplicateCheck(name: string, school: string) {
    startDuplicateCheck(async () => {
      if (!name.trim() || !school.trim()) {
        setDuplicates([]);
        return;
      }
      const matches = await checkDuplicateAction(name, school, excludeId);
      setDuplicates(matches);
    });
  }

  async function handlePostalCodeLookup() {
    setZipError(null);
    setIsLookingUp(true);
    const result = await lookupPostalCodeAction(postalCode);
    setIsLookingUp(false);
    if (result) {
      setAddress(result);
    } else {
      setZipError("該当する住所が見つかりませんでした。郵便番号をご確認ください。");
    }
  }

  return (
    <form action={formAction} className="card" style={{ maxWidth: 640 }}>
      {state.error && <div className="banner banner-error">{state.error}</div>}

      {duplicates.length > 0 && (
        <div className="banner banner-warning">
          <strong>同じ氏名・学校名の生徒が既に登録されています。</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            {duplicates.map((d) => (
              <li key={d.id}>
                {d.full_name}（{d.school_name}・{d.status === "archived" ? "アーカイブ" : "現役"}） —{" "}
                <Link href={`/students/${d.id}`} target="_blank">
                  既存の生徒を開く
                </Link>
              </li>
            ))}
          </ul>
          <p className="help-text" style={{ marginTop: 8, marginBottom: 0 }}>
            同姓同名の別人である場合は、そのまま保存を続けてください。
          </p>
        </div>
      )}

      <div className="field">
        <label htmlFor="fullName">氏名</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => runDuplicateCheck(fullName, schoolName)}
        />
      </div>

      <div className="field" style={{ display: "flex", gap: 8, alignItems: "end" }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="postalCode">郵便番号</label>
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            inputMode="numeric"
            placeholder="例: 100-0001"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            onBlur={(e) => setPostalCode(formatPostalCode(e.target.value))}
          />
        </div>
        <button
          type="button"
          className="btn"
          onClick={handlePostalCodeLookup}
          disabled={isLookingUp || postalCode.replace(/\D/g, "").length !== 7}
        >
          {isLookingUp ? "検索中..." : "住所を検索"}
        </button>
      </div>
      {zipError && <p className="error-text" style={{ marginTop: -8, marginBottom: 16 }}>{zipError}</p>}

      <div className="field">
        <label htmlFor="address">住所</label>
        <textarea
          id="address"
          name="address"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="schoolName">学校名</label>
        <input
          id="schoolName"
          name="schoolName"
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          onBlur={() => runDuplicateCheck(fullName, schoolName)}
        />
      </div>

      <div className="field">
        <label htmlFor="phone">電話番号</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={(e) => setPhone(formatPhoneNumber(e.target.value))}
        />
        <p className="help-text">自動整形されます。異なる場合は手動で修正してください。</p>
      </div>

      <div className="field">
        <label htmlFor="email">メールアドレス</label>
        <input id="email" name="email" type="text" defaultValue={initialValues.email} />
      </div>

      <div className="field">
        <label htmlFor="guardianName">保護者名</label>
        <input id="guardianName" name="guardianName" type="text" defaultValue={initialValues.guardianName} />
        <p className="help-text">ラベル印刷では実名は表示されず「保護者様」と表示されます。</p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "保存中..." : submitLabel}
        </button>
        <Link href={cancelHref} className="btn">
          キャンセル
        </Link>
      </div>
    </form>
  );
}
