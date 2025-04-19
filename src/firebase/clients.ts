import { db } from "./config";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { clientSchema, DataTable } from "@/types/client";

// ✅ Use Zod validation before writing to Firestore
export const createClient = async (client: DataTable) => {
  const parsed = clientSchema.safeParse(client);
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.format());
    throw new Error("Client data validation failed.");
  }

  const ref = doc(db, "clients", String(client.uuid));
  await setDoc(ref, {
    ...parsed.data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};
