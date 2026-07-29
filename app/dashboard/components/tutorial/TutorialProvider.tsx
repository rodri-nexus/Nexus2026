"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import TutorialOverlay from "./TutorialOverlay";
import CreateWidgetModalFake from "./CreateWidgetModalFake";
import {
  tutorialSteps,
  TOTAL_STEPS,
  type TutorialStep,
} from "./tutorialSteps";

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

interface TutorialProviderProps {
  children: ReactNode;
  // Si el usuario ya completó el onboarding en la DB
  initialCompleted: boolean;
}

export default function TutorialProvider({
  children,
  initialCompleted,
}: TutorialProviderProps) {
  // Arranca activo si NO está completado
  const [isActive, setIsActive] = useState<boolean>(!initialCompleted);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Para evitar guardar múltiples veces en la DB
  const savedRef = useRef<boolean>(initialCompleted);

  const currentStep: TutorialStep | null =
    isActive && currentStepIndex >= 0 && currentStepIndex < TOTAL_STEPS
      ? tutorialSteps[currentStepIndex]
      : null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOTAL_STEPS - 1;

  // ─────────────────────────────────────────────
  // Guardar en Supabase que el tutorial fue completado
  // ─────────────────────────────────────────────
  const markAsCompleted = useCallback(async () => {
    if (savedRef.current) return;
    savedRef.current = true;

    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error al marcar onboarding como completado:", err);
      // No revertimos savedRef → mejor no molestar al user si falla el guardado
    }
  }, []);

  // ─────────────────────────────────────────────
  // Navegación
  // ─────────────────────────────────────────────
  const goToStep = useCallback((index: number) => {
    if (index < 0 || index >= TOTAL_STEPS) return;
    setCurrentStepIndex(index);
  }, []);

  const handleNext = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= TOTAL_STEPS) return;

    const nextStep = tutorialSteps[nextIndex];

    // Si el próximo paso necesita el modal abierto, lo abrimos
    if (nextStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }

    // Si estamos saliendo del modal fake (nunca en este flujo, pero por si acaso)
    if (!nextStep.insideModal && modalOpen) {
      setModalOpen(false);
    }

    goToStep(nextIndex);
  }, [currentStepIndex, modalOpen, goToStep]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = tutorialSteps[prevIndex];

    // Si volvemos a un paso que NO está dentro del modal, cerramos el modal
    if (!prevStep.insideModal && modalOpen) {
      setModalOpen(false);
    }

    // Si volvemos a un paso que SÍ está dentro del modal, lo abrimos
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

  // ─────────────────────────────────────────────
  // Efecto: al arrancar, si el paso actual es insideModal, abrir el modal
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!isActive || !currentStep) return;
    if (currentStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }
  }, [isActive, currentStep, modalOpen]);

  // ─────────────────────────────────────────────
  // Handler cuando se toca "Crear mi primer widget" (paso 8, CTA del modal fake)
  // ─────────────────────────────────────────────
  const handleCreatePrimary = useCallback(() => {
    // Por ahora simplemente cierra el tutorial y el modal.
    // En la Parte 5, este handler abrirá el modal REAL de creación.
    finishTutorial();
  }, [finishTutorial]);

  // ─────────────────────────────────────────────
  // Valor del contexto
  // ─────────────────────────────────────────────
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
        // No permitimos cerrar manualmente durante el tutorial
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
