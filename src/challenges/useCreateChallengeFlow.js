import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { createChallenge } from '../challengeService';
import { canCreateChallengeTemplate, canUseProFeature, PRO_FEATURES } from '../proFeatures';
import { todayStr } from './challengeTheme';
import { buildChallengeShareLink } from './challengeShare';
import useCreatedChallengeShareActions from './useCreatedChallengeShareActions';

export default function useCreateChallengeFlow({ onCreate, profile }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState(null);
  const [customName, setCustomName] = useState('');
  const [startDate, setStartDate] = useState(todayStr());
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [proMessage, setProMessage] = useState('');
  const canCreatePrivate = canUseProFeature(profile, PRO_FEATURES.privateChallenges);
  const shareLink = created ? buildChallengeShareLink({ inviteCode: created.inviteCode, refUid: user.uid }) : '';
  const {
    copied,
    createdCampaignShareText,
    handleCopy,
    handleCreatedLaunchCardShare,
  } = useCreatedChallengeShareActions({ created, shareLink });

  const handleCreate = async () => {
    setLoading(true);
    const effectiveIsPublic = canCreatePrivate ? isPublic : true;
    try {
      const challenge = await createChallenge(user.uid, template, customName, startDate, effectiveIsPublic);
      setCreated(challenge);
      setStep(3);
      onCreate?.();
    } catch (err) {
      setProMessage(err?.message || 'Could not create challenge.');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = selectedTemplate => {
    if (!canCreateChallengeTemplate(profile, selectedTemplate)) {
      setProMessage('Premium challenge packs unlock with Tribe Pro or a pack purchase.');
      return;
    }
    setProMessage('');
    setTemplate(selectedTemplate);
    setCustomName(selectedTemplate.name);
    setStep(2);
  };

  return {
    canCreatePrivate,
    copied,
    created,
    createdCampaignShareText,
    customName,
    handleCopy,
    handleCreate,
    handleCreatedLaunchCardShare,
    handleTemplateSelect,
    isPublic,
    loading,
    proMessage,
    setCustomName,
    setIsPublic,
    setProMessage,
    setStartDate,
    setStep,
    shareLink,
    startDate,
    step,
    template,
  };
}
