// Contrato compartido para los datos del onboarding del donante guardados en
// localStorage. Lo usan tanto el paso 1 (formulario) como el paso 2
// (recomendaciones).

export const ONBOARDING_STORAGE_KEY = "onboarding-donante";

export type OnboardingData = {
  name: string;
  interests: number[]; // ids de orgTypes
};

export function readOnboarding(): OnboardingData {
  const empty: OnboardingData = { name: "", interests: [] };
  if (typeof window === "undefined") return empty;

  const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingData>;
    return {
      name: parsed.name ?? "",
      interests: parsed.interests ?? [],
    };
  } catch {
    return empty;
  }
}

export function saveOnboarding(data: OnboardingData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
}
