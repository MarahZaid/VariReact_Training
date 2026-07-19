import { ref, get, update, query, orderByChild, equalTo } from "firebase/database";
import { db } from "./firebase/firebaseConfig";

// يرجع { id, ...data } لسجل الزبون المرتبط بهاد الـ uid، أو null
export async function getCustomerByUid(uid) {
  const customersRef = ref(db, "customers");
  const customerQuery = query(customersRef, orderByChild("uid"), equalTo(uid));
  const snapshot = await get(customerQuery);

  if (!snapshot.exists()) return null;

  const data = snapshot.val();
  const [id] = Object.keys(data);
  return { id, ...data[id] };
}

// يحدّث حقول معينة بسجل الزبون (مش استبدال كامل، بس تحديث جزئي)
export async function updateCustomerProfile(customerId, updates) {
  await update(ref(db, `customers/${customerId}`), updates);
}