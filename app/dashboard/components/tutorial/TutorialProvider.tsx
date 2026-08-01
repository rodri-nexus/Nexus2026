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

// ─── Provider ───

interface TutorialProviderProps {
  children: ReactNode;
  initialCompleted: boolean;
}

export default function TutorialProvider({
  children,
  initialCompleted,
}: TutorialProviderProps) {
  // SOLO se activa si initialCompleted es false (primera vez)
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Ref para evitar que se active más de una vez por sesión
  const hasInitialized = useRef(false);

  // Inicializar UNA SOLA VEZ al montar
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (!initialCompleted) {
      setIsActive(true);
      setCurrentStepIndex(0);
    }
  }, [initialCompleted]);

  const savedRef = useRef<boolean>(initialCompleted);

  const currentStep: TutorialStep | null =
    isActive && currentStepIndex >= 0 && currentStepIndex < TOTAL_STEPS
      ? tutorialSteps[currentStepIndex]
      : null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOTAL_STEPS - 1;

  // ─── Guardar en Supabase que el tutorial fue completado ───

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
    }
  }, []);

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
