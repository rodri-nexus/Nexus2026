// app/dashboard/components/tutorial/TutorialProvider.tsx
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

// ─── Helpers ───

const OLD_STORAGE_KEY = "nevux_tutorial_completed";

function getStorageKey(userId: string | null | undefined): string {
  if (userId) {
    return `nevux_tutorial_completed_${userId}`;
  }
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
  const STORAGE_KEY = getStorageKey(userId);

  // HOTFIX:
  // Arrancamos SIEMPRE con el tutorial desactivado.
  // Esto evita que cualquier overlay automático bloquee clicks en dashboard.
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Cleanup de la clave vieja para no dejar basura en localStorage
  useEffect(() => {
    try {
      if (localStorage.getItem(OLD_STORAGE_KEY) !== null) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, []);

  // Si por algún motivo el onboarding ya figura como completado,
  // nos aseguramos de mantener todo cerrado.
  useEffect(() => {
    if (initialCompleted && isActive) {
      setIsActive(false);
      setModalOpen(false);
      setCurrentStepIndex(0);
    }
  }, [initialCompleted, isActive]);

  const currentStep: TutorialStep | null =
    isActive && currentStepIndex >= 0 && currentStepIndex < TOTAL_STEPS
      ? tutorialSteps[currentStepIndex]
      : null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOTAL_STEPS - 1;

  // ─── Guardar en Supabase y localStorage ───

  const markAsCompleted = useCallback(async () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignorar errores de localStorage
    }

    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("API error");
      }
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

  // Lo dejamos para futuro botón manual "Ver tutorial"
  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setModalOpen(false);
    setIsActive(true);
  }, []);

  // Si el paso actual necesita modal fake, sincronizarlo
  useEffect(() => {
    if (!isActive || !currentStep) return;

    if (currentStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }

    if (!currentStep.insideModal && modalOpen) {
      setModalOpen(false);
    }
  }, [isActive, currentStep, modalOpen]);

  const handleCreatePrimary = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  const contextValue: TutorialContextValue = {
    isActive,
    currentStepIndex,
    startTutorial,
    skipTutorial,
  };

  const showTutorial = isActive && currentStep !== null;

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}

      {showTutorial && currentStep && (
        <>
          <CreateWidgetModalFake
            isOpen={modalOpen}
            onClose={undefined}
            onCreatePrimary={handleCreatePrimary}
            showCTA={currentStep.id === "listo"}
          />

          <TutorialOverlay
            key={String(currentStep.id)}
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
        </>
      )}
    </TutorialContext.Provider>
  );
}
