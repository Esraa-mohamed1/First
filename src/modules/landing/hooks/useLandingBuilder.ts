import { useLandingStore } from '../store/landingStore';

export function useLandingBuilder() {
  const activeSectionId = useLandingStore(state => state.activeSectionId);
  const setActiveSectionId = useLandingStore(state => state.setActiveSectionId);
  const templateName = useLandingStore(state => state.templateName);
  const setTemplateName = useLandingStore(state => state.setTemplateName);
  const isActive = useLandingStore(state => state.isActive);
  const setIsActive = useLandingStore(state => state.setIsActive);
  const resetToDefaults = useLandingStore(state => state.resetToDefaults);

  return {
    activeSectionId,
    setActiveSectionId,
    templateName,
    setTemplateName,
    isActive,
    setIsActive,
    resetToDefaults
  };
}
