export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          background: "white",
          padding: "3rem 2rem",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            margin: "0 0 1rem 0",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Nevux
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "#6b7280",
            margin: "0 0 2rem 0",
          }}
        >
          Aumentá el ticket promedio de tu tienda online
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          App oficial para Tiendanube
        </p>
      </div>
    </main>
  );
}
