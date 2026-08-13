"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import TutorialOverlay from "./TutorialOverlay";
import CreateWidgetModalFake from "./CreateWidgetModalFake";
import {
  tutorialSteps,
  TOTAL_STEPS,
  type TutorialStep,
} from "./tutorialSteps";

// ─── Context ───

interface TutorialContextValue {
  isActive: boolean;
  currentStepIndex: number;
  startTutorial: () => void;
  skipTutorial: () => void;
}

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error("useTutorial debe usarse dentro de <TutorialProvider>");
  }
  return ctx;
}

// ─── Helper para armar la clave por usuario ───
// Cada usuario tiene su propia key en localStorage para que el tutorial
// se muestre correctamente cuando cambia el usuario logueado en el mismo navegador.
const OLD_STORAGE_KEY = "nevux_tutorial_completed"; // clave vieja (compartida entre usuarios)

function getStorageKey(userId: string | null | undefined): string {
  if (userId) {
    return `nevux_tutorial_completed_${userId}`;
  }
  // Fallback muy defensivo: si por algún motivo no viene el userId,
  // usamos la clave vieja para no romper.
  return OLD_STORAGE_KEY;
}

// ─── Provider ───

interface TutorialProviderProps {
  children: ReactNode;
  initialCompleted: boolean;
  userId: string | null;
}

export default function TutorialProvider({
  children,
  initialCompleted,
  userId,
}: TutorialProviderProps) {
  // Cleanup: borrar la clave vieja (sin userId) para no dejar basura de la versión anterior.
  // Se ejecuta 1 sola vez al montar el componente en el browser.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(OLD_STORAGE_KEY) !== null) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de localStorage (modo privado, etc.)
    }
  }, []);

  // Clave dinámica por usuario
  const STORAGE_KEY = getStorageKey(userId);

  // localStorage como fuente de verdad del navegador (por usuario)
  const wasCompletedInBrowser =
    typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEY) === "true"
      : false;

  const shouldShow = !initialCompleted && !wasCompletedInBrowser;

  const [isActive, setIsActive] = useState<boolean>(shouldShow);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const currentStep: TutorialStep | null =
    isActive && currentStepIndex >= 0 && currentStepIndex < TOTAL_STEPS
      ? tutorialSteps[currentStepIndex]
      : null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOTAL_STEPS - 1;

  // ─── Guardar en Supabase y localStorage que el tutorial fue completado ───

  const markAsCompleted = useCallback(async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // Ignorar errores de localStorage
      }
    }

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("API error");
    } catch (err) {
      console.error("Error al marcar onboarding como completado:", err);
    }
  }, [STORAGE_KEY]);

  // ─── Navegación ───

  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_STEPS) return;
    setCurrentStepIndex(index);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= TOTAL_STEPS) return;

    const nextStep = tutorialSteps[nextIndex];

    if (nextStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }

    if (!nextStep.insideModal && modalOpen) {
      setModalOpen(false);
    }

    goToStep(nextIndex);
  }, [currentStepIndex, modalOpen, goToStep]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = tutorialSteps[prevIndex];

    if (!prevStep.insideModal && modalOpen) {
      setModalOpen(false);
    }

    if (prevStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }

    goToStep(prevIndex);
  }, [currentStepIndex, modalOpen, goToStep]);

  const finishTutorial = useCallback(() => {
    setIsActive(false);
    setModalOpen(false);
    setCurrentStepIndex(0);
    markAsCompleted();
  }, [markAsCompleted]);

  const skipTutorial = useCallback(() => {
    setIsActive(false);
    setModalOpen(false);
    setCurrentStepIndex(0);
    markAsCompleted();
  }, [markAsCompleted]);

  // Re-lanzar el tutorial manualmente (para futuro botón "Ver tutorial")
  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setModalOpen(false);
    setIsActive(true);
  }, []);

  // ─── Efecto: al arrancar, si el paso actual es insideModal, abrir el modal ───
  useEffect(() => {
    if (!isActive || !currentStep) return;
    if (currentStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }
  }, [isActive, currentStep, modalOpen]);

  // ─── Handler cuando se toca "Crear mi primer widget" (paso 8, CTA del modal fake) ───
  const handleCreatePrimary = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  // ─── Valor del contexto ───
  const contextValue: TutorialContextValue = {
    isActive,
    currentStepIndex,
    startTutorial,
    skipTutorial,
  };

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}

      {/* Modal fake (aparece en pasos 5, 6, 7, 8) */}
      <CreateWidgetModalFake
        isOpen={isActive && modalOpen}
        onClose={undefined}
        onCreatePrimary={handleCreatePrimary}
        showCTA={currentStep?.id === "listo"}
      />

      {/* Overlay + spotlight + card */}
      {isActive && currentStep && (
        <TutorialOverlay
          key={currentStep.id}
          step={currentStep}
          stepIndex={currentStepIndex}
          totalSteps={TOTAL_STEPS}
          isFirst={isFirst}
          isLast={isLast}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={skipTutorial}
          onFinish={finishTutorial}
        />
      )}
    </TutorialContext.Provider>
  );
    }
