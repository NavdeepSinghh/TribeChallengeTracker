import { useState } from "react";
import { saveSharePreferences } from "../userService";
import { V1_PAID_FEATURES_ENABLED } from "../proFeatures";
import { SHARE_TEMPLATES } from "./activityModel";
import { makeProgressShareImageBlob, progressShareText } from "./progressShare";

export default function useProgressShareActions({
  hasActivePro,
  setUserProfile,
  shareStats,
  shareTemplateId,
  showToast,
  user,
}) {
  const [savingShareTemplate, setSavingShareTemplate] = useState(false);

  const handleShareTemplateSelect = async (templateId) => {
    const template = SHARE_TEMPLATES.find(t => t.id === templateId) || SHARE_TEMPLATES[0];
    if (V1_PAID_FEATURES_ENABLED && template.pro && !hasActivePro) {
      showToast("Premium share templates are planned for a later release");
      return;
    }
    if (!user || template.id === shareTemplateId || savingShareTemplate) return;
    setSavingShareTemplate(true);
    try {
      const sharePreferences = await saveSharePreferences(user.uid, { templateId: template.id });
      setUserProfile(prev => ({ ...(prev || {}), sharePreferences }));
      showToast(`${template.label} share template saved`);
    } catch (e) {
      console.error("[Share templates]", e);
      showToast("Could not save share template");
    } finally {
      setSavingShareTemplate(false);
    }
  };

  const handleProgressShare = async (target) => {
    const text = progressShareText(shareStats);
    try {
      if (target === "copy") {
        await navigator.clipboard.writeText(text);
        showToast("Progress copied");
        return;
      }

      if (target === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
        showToast("Opening WhatsApp share");
        return;
      }

      const blob = await makeProgressShareImageBlob(shareStats);
      const file = blob ? new File([blob], "rise-with-the-tribe-progress.png", { type: "image/png" }) : null;
      if (navigator.share && file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: "Rise With The Tribe", text, files: [file] });
        showToast(target === "story" ? "Choose Instagram Story" : "Progress shared");
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Rise With The Tribe", text });
        showToast(target === "story" ? "Choose Instagram Story" : "Progress shared");
        return;
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "rise-with-the-tribe-progress.png";
        a.click();
        URL.revokeObjectURL(url);
      }
      await navigator.clipboard?.writeText(text);
      showToast("Progress image downloaded");
    } catch (e) {
      console.error("[Share]", e);
      showToast("Could not share progress");
    }
  };

  return {
    handleProgressShare,
    handleShareTemplateSelect,
    savingShareTemplate,
  };
}
