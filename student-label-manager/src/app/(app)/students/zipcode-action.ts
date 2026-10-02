"use server";

import { getUserOrNull } from "@/lib/auth-guard";
import { lookupAddressByPostalCode } from "@/lib/zipcode";

export async function lookupPostalCodeAction(postalCode: string): Promise<string | null> {
  const user = await getUserOrNull();
  if (!user) return null;

  return lookupAddressByPostalCode(postalCode);
}
