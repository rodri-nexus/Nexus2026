import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ecfdf5",
        padding: "2rem 1.25rem",
        fontFamily: "-apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          background: "#ffffff",
          border: "2px solid #10B981",
          borderRadius: "16px",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#10B981", margin: "0 0 0.5rem" }}>
          ✅ Dashboard Vivo
        </h1>
        <p style={{ color: "#000000", fontSize: "0.9rem" }}>
          Usuario: {user.email}
        </p>
      </div>
    </div>
  );
}
