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

function isCompletedInStorage(key: string): boolean {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
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

  // Guard de hidratación — evita cualquier acción antes de que
  // el cliente esté listo y localStorage sea accesible
  const [hydrated, setHydrated] = useState(false);

  // El tutorial arranca SIEMPRE cerrado
  // Se abre solo en el useEffect post-hidratación si corresponde
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Post-hidratación: lógica de auto-show ───
  // Se ejecuta 1 sola vez al montar el componente en el cliente.
  // Regla: mostrar si y solo si:
  //   1. localStorage NO tiene el flag de completado (fuente de verdad #1)
  //   2. Supabase tampoco lo tiene (initialCompleted === false)
  // Si cualquiera de los dos dice "completado" → nunca mostrar
  useEffect(() => {
    // Cleanup de la clave vieja para no dejar basura
    try {
      if (localStorage.getItem(OLD_STORAGE_KEY) !== null) {
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    } catch {
      // ignorar
    }

    const completedInStorage = isCompletedInStorage(STORAGE_KEY);
    const completedAnywhere = completedInStorage || initialCompleted;

    if (!completedAnywhere) {
      // Usuario nuevo: mostrar tutorial automáticamente
      setIsActive(true);
    }

    // Marcar como hidratado DESPUÉS de decidir si mostrar o no
    // Esto evita cualquier flash
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 
  // Dependencias vacías a propósito:
  // Este efecto corre 1 sola vez al montar.
  // initialCompleted y STORAGE_KEY no deben re-dispararlo nunca.

  // ─── Guardar en localStorage y Supabase ───

  const markAsCompleted = useCallback(async () => {
    // localStorage primero — fuente de verdad #1
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignorar
    }

    // Supabase — fuente de verdad #2
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

  // Botón manual "Ver tutorial" — disponible a futuro
  const startTutorial = useCallback(() => {
    // Solo permitir si ya está hidratado
    if (!hydrated) return;
    setCurrentStepIndex(0);
    setModalOpen(false);
    setIsActive(true);
  }, [hydrated]);

  // Sincronizar modal con el paso actual
  useEffect(() => {
    if (!isActive) return;
    const currentStep = tutorialSteps[currentStepIndex];
    if (!currentStep) return;

    if (currentStep.insideModal && !modalOpen) {
      setModalOpen(true);
    }
    if (!currentStep.insideModal && modalOpen) {
      setModalOpen(false);
    }
  }, [isActive, currentStepIndex, modalOpen]);

  const handleCreatePrimary = useCallback(() => {
    finishTutorial();
  }, [finishTutorial]);

  // ─── Render ───

  const currentStep: TutorialStep | null =
    isActive && currentStepIndex >= 0 && currentStepIndex < TOTAL_STEPS
      ? tutorialSteps[currentStepIndex]
      : null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOTAL_STEPS - 1;

  // NO renderizar el overlay hasta que el cliente esté hidratado
  // Esto evita hydration mismatch y flashes
  const showTutorial = hydrated && isActive && currentStep !== null;

  const contextValue: TutorialContextValue = {
    isActive,
    currentStepIndex,
    startTutorial,
    skipTutorial,
  };

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
