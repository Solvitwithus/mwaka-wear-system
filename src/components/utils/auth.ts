import axios from "axios";

export async function getPermissions() {
  try {
    const res = await axios.get("/api/auth/access", { withCredentials: true }); // make sure cookies are sent
 
    return res.data.permissions;
  } catch (error) {
    console.log("❌ Error fetching permissions:", error);
    return null;
  }
}
