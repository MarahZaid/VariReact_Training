import { ref, get, update, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../firebase/firebaseConfig";


export async function getCustomerByUid(uid) {
  const customersRef = ref(db, "customers");
  const customerQuery = query(customersRef, orderByChild("uid"), equalTo(uid));
  const snapshot = await get(customerQuery);

  if (!snapshot.exists()) return null;

  const data = snapshot.val();
  const [id] = Object.keys(data);
  return { id, ...data[id] };
}


export async function updateCustomerProfile(customerId, updates) {
  await update(ref(db, `customers/${customerId}`), updates);
}