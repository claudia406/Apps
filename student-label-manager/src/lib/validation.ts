import { z } from "zod";

// 要件上、入力必須項目は存在しない。空欄のまま保存できる。
// 値が入っている場合のみ、ごく基本的な形式チェックを行う。

const optionalText = z.string().trim().max(200).default("");

export const studentSchema = z.object({
  fullName: optionalText,
  furigana: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || /^[゠-ヿｦ-ﾟー　\s]*$/.test(v), {
      message: "フリガナはカタカナで入力してください。",
    })
    .default(""),
  postalCode: z
    .string()
    .trim()
    .max(10)
    .refine((v) => v === "" || /^\d{3}-?\d{4}$/.test(v), {
      message: "郵便番号は7桁の数字で入力してください。",
    })
    .default(""),
  address: z.string().trim().max(500).default(""),
  schoolName: optionalText,
  phone: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || /^[\d-]{7,20}$/.test(v), {
      message: "電話番号は数字とハイフンのみで入力してください。",
    })
    .default(""),
  email: z
    .string()
    .trim()
    .max(200)
    .refine((v) => v === "" || z.string().email().safeParse(v).success, {
      message: "メールアドレスの形式が正しくありません。",
    })
    .default(""),
  guardianName: optionalText,
});

export type StudentInput = z.infer<typeof studentSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email({ message: "メールアドレスの形式が正しくありません。" }),
  password: z.string().min(1, "パスワードを入力してください。"),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "現在のパスワードを入力してください。"),
    newPassword: z.string().min(8, "新しいパスワードは8文字以上で入力してください。"),
    newPasswordConfirm: z.string().min(1, "確認用パスワードを入力してください。"),
  })
  .refine((v) => v.newPassword === v.newPasswordConfirm, {
    message: "新しいパスワードと確認用パスワードが一致しません。",
    path: ["newPasswordConfirm"],
  });

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "パスワードは8文字以上で入力してください。"),
    newPasswordConfirm: z.string().min(1, "確認用パスワードを入力してください。"),
  })
  .refine((v) => v.newPassword === v.newPasswordConfirm, {
    message: "パスワードと確認用パスワードが一致しません。",
    path: ["newPasswordConfirm"],
  });
