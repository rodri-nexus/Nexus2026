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
  if (userId) return `nevux_tutorial_completed_${userId}`;
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

  // ✅ FIX: arrancamos siempre en false (seguro para SSR)
  // El useEffect de abajo decide si activar el tutorial
  // DESPUÉS de que React hidrata en el browser
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // ✅ FIX: leer localStorage SOLO después de hidratación
  // Así evitamos el mismatch SSR/CSR que dejaba isActive=true invisible
  useEffect(() => {
    // Limpiar clave vieja
    try {
      if (localStorage.getItem(OLD_STORAGE_KEY) !== null) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    } catch {
      // Ignorar errores de localStorage
    }

    // Leer si ya completó el tutorial en este browser
    let wasCompletedInBrowser = false;
    try {
      wasCompletedInBrowser = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // Ignorar errores de localStorage
    }

    // Solo activar tutorial si NO está completado en Supabase
    // Y NO está completado en este browser
    const shouldShow = !initialCompleted && !wasCompletedInBrowser;
    setIsActive(shouldShow);
    setHydrated(true);
  }, [initialCompleted, STORAGE_KEY]);

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

    if (nextStep.insideModal && !modalOpen) setModalOpen(true);
    if (!nextStep.insideModal && modalOpen) setModalOpen(false);

    goToStep(nextIndex);
  }, [currentStepIndex, modalOpen, goToStep]);

  const handlePrev = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex < 0) return;

    const prevStep = tutorialSteps[prevIndex];

    if (!prevStep.insideModal && modalOpen) setModalOpen(false);
    if (prevStep.insideModal && !modalOpen) setModalOpen(true);

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

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setModalOpen(false);
    setIsActive(true);
  }, []);

  // ─── Efecto: si el paso actual es insideModal, abrir el modal ───
  useEffect(() => {
    if (!isActive || !currentStep) return;
    if (currentStep.insideModal && !modalOpen) setModalOpen(true);
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

  // ✅ FIX: no renderizar nada relacionado al tutorial
  // hasta que el browser haya hidratado y leído localStorage
  // Esto garantiza que el overlay NUNCA se monte por error durante SSR
  const showTutorial = hydrated && isActive && currentStep !== null;

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}

      {showTutorial && (
        <>
          <CreateWidgetModalFake
            isOpen={modalOpen}
            onClose={undefined}
            onCreatePrimary={handleCreatePrimary}
            showCTA={currentStep?.id === "listo"}
          />

          <TutorialOverlay
            key={currentStep!.id}
            step={currentStep!}
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
