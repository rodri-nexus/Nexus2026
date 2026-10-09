"use client";

import React, { useState } from "react";
import { Upload, Image as ImageIcon, Sparkles, Sliders, Layout } from "lucide-react";

interface ComparadorAntesDespuesEditorProps {
  config: Record<string, any>;
  onChange: (newConfig: Record<string, any>) => void;
}

export default function ComparadorAntesDespuesEditor({
  config,
  onChange,
}: ComparadorAntesDespuesEditorProps) {
  const [activeTab, setActiveTab] = useState<"general" | "estilos" | "ubicacion">("general");
  const [uploadingAntes, setUploadingAntes] = useState(false);
  const [uploadingDespues, setUploadingDespues] = useState(false);

  // Valores por defecto
  const titulo = config.titulo ?? "Resultado Antes y Después";
  const subtitulo = config.subtitulo ?? "Desliza el control para comparar la transformación";
  const imagenAntes = config.imagen_antes ?? "https://images.unsplash.com/photo-1512290900676-26c2a48f341d?auto=format&fit=crop&w=800&q=80";
  const imagenDespues = config.imagen_despues ?? "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80";
  const etiquetaAntes = config.etiqueta_antes ?? "ANTES";
  const etiquetaDespues = config.etiqueta_despues ?? "DESPUÉS";
  const mostrarEtiquetas = config.mostrar_etiquetas ?? true;
  const posicionInicial = config.posicion_inicial ?? 50;

  // Estilos
  const colorDeslizador = config.color_deslizador ?? "#ffffff";
  const colorEtiquetaTexto = config.color_etiqueta_texto ?? "#ffffff";
  const colorEtiquetaFondo = config.color_etiqueta_fondo ?? "rgba(0,0,0,0.6)";
  const bordeRedondeado = config.borde_redondeado ?? 12;
  const paddingTop = config.padding_top ?? 16;
  const paddingBottom = config.padding_bottom ?? 16;
  const aspectRatio = config.aspect_ratio ?? "4/3";

  // Ubicación
  const ubicacion = config.ubicacion ?? "debajo_descripcion";

  const handleChange = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    setUploading: (b: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleChange(fieldKey, base64String);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error al cargar la imagen:", err);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Pestañas */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "general"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("estilos")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "estilos"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Estilos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ubicacion")}
          className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "ubicacion"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Layout className="w-4 h-4" />
          Ubicación
        </button>
      </div>

      {/* Pestaña: General */}
      {activeTab === "general" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título del Widget
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
              placeholder="Ej: Transformación Antes y Después"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subtítulo / Instrucción
            </label>
            <input
              type="text"
              value={subtitulo}
              onChange={(e) => handleChange("subtitulo", e.target.value)}
              placeholder="Ej: Desliza la barra para ver el cambio"
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          {/* Seccion Imagen ANTES */}
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" /> Imagen ANTES
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                URL de la imagen
              </label>
              <input
                type="text"
                value={imagenAntes}
                onChange={(e) => handleChange("imagen_antes", e.target.value)}
                placeholder="https://ejemplo.com/antes.jpg"
                className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                O subir archivo directamente:
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 hover:border-blue-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{uploadingAntes ? "Cargando..." : "Seleccionar Imagen Antes"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imagen_antes", setUploadingAntes)}
                  className="hidden"
                  disabled={uploadingAntes}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Etiqueta "Antes"
              </label>
              <input
                type="text"
                value={etiquetaAntes}
                onChange={(e) => handleChange("etiqueta_antes", e.target.value)}
                placeholder="ANTES"
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Seccion Imagen DESPUES */}
          <div className="p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-500" /> Imagen DESPUÉS
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                URL de la imagen
              </label>
              <input
                type="text"
                value={imagenDespues}
                onChange={(e) => handleChange("imagen_despues", e.target.value)}
                placeholder="https://ejemplo.com/despues.jpg"
                className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                O subir archivo directamente:
              </label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-300 hover:border-emerald-500 cursor-pointer bg-white dark:bg-gray-800 transition-colors">
                <Upload className="w-4 h-4 text-gray-500" />
                <span>{uploadingDespues ? "Cargando..." : "Seleccionar Imagen Después"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "imagen_despues", setUploadingDespues)}
                  className="hidden"
                  disabled={uploadingDespues}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Etiqueta "Después"
              </label>
              <input
                type="text"
                value={etiquetaDespues}
                onChange={(e) => handleChange("etiqueta_despues", e.target.value)}
                placeholder="DESPUÉS"
                className="w-full px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Mostrar Etiquetas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Muestra o esconde las etiquetas sobre las imágenes</p>
            </div>
            <input
              type="checkbox"
              checked={mostrarEtiquetas}
              onChange={(e) => handleChange("mostrar_etiquetas", e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Posición Inicial del Deslizador ({posicionInicial}%)
            </label>
            <input
              type="range"
              min="10"
              max="90"
              value={posicionInicial}
              onChange={(e) => handleChange("posicion_inicial", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>
      )}

      {/* Pestaña: Estilos */}
      {activeTab === "estilos" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proporción de la Imagen
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Cuadrado (1:1)", value: "1/1" },
                { label: "Estándar (4:3)", value: "4/3" },
                { label: "Panorámico (16:9)", value: "16/9" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange("aspect_ratio", opt.value)}
                  className={`p-3 text-xs border rounded-xl font-medium text-center transition-all ${
                    aspectRatio === opt.value
                      ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color de la Barra
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorDeslizador}
                  onChange={(e) => handleChange("color_deslizador", e.target.value)}
                  className="h-9 w-12 rounded border p-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={colorDeslizador}
                  onChange={(e) => handleChange("color_deslizador", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fondo de Etiquetas
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorEtiquetaFondo.startsWith("#") ? colorEtiquetaFondo : "#000000"}
                  onChange={(e) => handleChange("color_etiqueta_fondo", e.target.value)}
                  className="h-9 w-12 rounded border p-1 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={colorEtiquetaFondo}
                  onChange={(e) => handleChange("color_etiqueta_fondo", e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Redondeo de Bordes
              </label>
              <span className="text-xs text-gray-500 font-mono">{bordeRedondeado}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              step="2"
              value={bordeRedondeado}
              onChange={(e) => handleChange("borde_redondeado", Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Espaciado Sup.
                </label>
                <span className="text-xs text-gray-500 font-mono">{paddingTop}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="4"
                value={paddingTop}
                onChange={(e) => handleChange("padding_top", Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Espaciado Inf.
                </label>
                <span className="text-xs text-gray-500 font-mono">{paddingBottom}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="4"
                value={paddingBottom}
                onChange={(e) => handleChange("padding_bottom", Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Ubicación */}
      {activeTab === "ubicacion" && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Posición del Widget en la Ficha de Producto
          </label>
          
          {[
            { id: "debajo_descripcion", name: "Debajo de la Descripción", desc: "Aparece justo debajo del texto descriptivo del producto." },
            { id: "debajo_boton_comprar", name: "Debajo del Botón de Compra", desc: "Muestra la comparación inmediatamente después del botón de añadir al carrito." },
            { id: "encima_comentarios", name: "Sección de Reseñas / Comentarios", desc: "Muestra la comparación cerca de los testimonios o valoraciones." },
          ].map((loc) => (
            <label
              key={loc.id}
              className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                ubicacion === loc.id
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <input
                type="radio"
                name="ubicacion_comparador"
                checked={ubicacion === loc.id}
                onChange={() => handleChange("ubicacion", loc.id)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{loc.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{loc.desc}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
  }
