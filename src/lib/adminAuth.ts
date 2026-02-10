import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return session;
}
