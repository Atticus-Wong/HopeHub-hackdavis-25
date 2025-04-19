import { db } from "./config";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";

export const seedServiceTypes = async () => {
  const services = [
    { id: "SHOWER", label: "Shower", category: "drop-in", isActive: true },
    { id: "LAUNDRY", label: "Laundry", category: "drop-in", isActive: true },
    {
      id: "MNGMT",
      label: "Case Management",
      category: "case-management",
      isActive: true,
    },
  ];

  for (const s of services) {
    await setDoc(doc(db, "serviceTypes", s.id), s);
  }
};

export const getServiceTypes = async () => {
  const querySnapshot = await getDocs(collection(db, "serviceTypes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
