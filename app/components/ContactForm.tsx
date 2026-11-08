"use client";

import { useState } from "react";

type InteresOption = "premium" | "basico" | "consulta";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    negocio: "",
    email: "",
    tiendanube: "",
    interes: "premium" as InteresOption,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Validación básica
    if (!formData.negocio || !formData.email) {
      setStatus("error");
      setErrorMessage("Por favor completá tu nombre y email");
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Por favor ingresá un email válido");
      return;
    }

    try {
      // TODO: Integrar con backend o servicio de email
      // Por ahora simulamos el envío
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Aquí iría la llamada real a tu API/servicio de email
      // Ejemplo con mailto: temporal
      const mailtoLink = `mailto:contacto@nevux.ar?subject=Demo Nevux - ${formData.negocio}&body=Negocio: ${formData.negocio}%0D%0AEmail: ${formData.email}%0D%0ATiendanube: ${formData.tiendanube}%0D%0AInterés: ${formData.interes}`;
      
      console.log("Formulario enviado:", formData);
      
      setStatus("success");
      
      // Reset form
      setTimeout(() => {
        setFormData({
          negocio: "",
          email: "",
          tiendanube: "",
          interes: "premium",
        });
        setStatus("idle");
      }, 3000);
    } catch (error) {
      setStatus("error");
      setErrorMessage("Hubo un error al enviar el formulario. Intentá de nuevo.");
      console.error("Error:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="form">
      {/* Nombre del negocio */}
      <div>
        <label htmlFor="negocio" className="block text-sm font-medium text-slate-700 mb-1">
          Nombre del negocio *
        </label>
        <input
          type="text"
          id="negocio"
          name="negocio"
          value={formData.negocio}
          onChange={handleChange}
          placeholder="Tu tienda"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* URL de Tiendanube */}
      <div>
        <label htmlFor="tiendanube" className="block text-sm font-medium text-slate-700 mb-1">
          URL de tu Tiendanube
        </label>
        <input
          type="url"
          id="tiendanube"
          name="tiendanube"
          value={formData.tiendanube}
          onChange={handleChange}
          placeholder="https://tutienda.mitiendanube.com"
          disabled={status === "loading"}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-slate-500 mt-1">
          Opcional: si ya tenés tu tienda
        </p>
      </div>

      {/* Interés */}
      <div>
        <label htmlFor="interes" className="block text-sm font-medium text-slate-700 mb-1">
          ¿Qué te interesa? *
        </label>
        <select
          id="interes"
          name="interes"
          value={formData.interes}
          onChange={handleChange}
          required
          disabled={status === "loading"}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
          <option value="premium">Plan Premium</option>
          <option value="basico">Plan Básico</option>
          <option value="consulta">Solo una consulta</option>
        </select>
      </div>

      {/* Error message */}
      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}

      {/* Success message */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 font-medium">
            ✓ ¡Mensaje enviado! Te contactamos en las próximas 24 hs.
          </p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Enviando...
          </>
        ) : status === "success" ? (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Enviado
          </>
        ) : (
          "Pedir mi demo ahora"
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        Al enviar este formulario aceptás recibir comunicaciones de Nevux
      </p>
    </form>
  );
}
