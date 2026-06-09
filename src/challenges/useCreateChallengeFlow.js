import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { createChallenge } from '../challengeService';
import { canCreateChallengeTemplate, canUseProFeature, PRO_FEATURES } from '../proFeatures';
import { getPublishedCreatorChallengeTemplates } from '../userServices/creatorChallengeTemplateDraftService';
import { todayStr } from './challengeTheme';
import { buildChallengeShareLink } from './challengeShare';
import useCreatedChallengeShareActions from './useCreatedChallengeShareActions';

const DEFAULT_CREATOR_TEMPLATE_RULES = [
  'Complete the creator-defined proof habit each day',
  'Log activity in the app before bed',
  'Share progress only when consent and safety boundaries are clear',
];

const DEFAULT_CREATOR_TEMPLATE_TASKS = [
  { id: 'proof_habit', label: 'Creator proof habit completed', emoji: '✅' },
  { id: 'logged', label: 'Logged in app', emoji: '📱' },
  { id: 'support', label: 'Encouraged the tribe', emoji: '📣' },
];

function normalizePublishedCreatorTemplate(template = {}) {
  return {
    ...template,
    id: template.id || template.templateId,
    name: template.name || 'Creator hosted challenge',
    emoji: template.emoji || '🌟',
    color: template.color || '#10B981',
    duration: Number(template.duration) || 7,
    difficulty: template.difficulty || 'creator-led',
    tagline: template.tagline || template.creatorBio || template.creatorSpecialty || 'Reusable creator-led accountability challenge',
    rules: Array.isArray(template.rules) && template.rules.length ? template.rules : DEFAULT_CREATOR_TEMPLATE_RULES,
    tasks: Array.isArray(template.tasks) && template.tasks.length ? template.tasks : DEFAULT_CREATOR_TEMPLATE_TASKS,
    dailyPrompts: Array.isArray(template.dailyPrompts) ? template.dailyPrompts : [],
    disclaimer: template.disclaimer || 'This creator challenge template is for accountability and general habit formation. It is not medical advice. Adjust intensity to your needs.',
    isPremium: false,
    source: 'creatorChallengeTemplates',
    creatorTemplateId: template.id || template.templateId || '',
    creatorTemplateDraftId: template.draftId || '',
    creatorTemplateOwnerUid: template.uid || '',
    creatorTemplateOwnerName: template.creatorName || '',
    campaignLabel: template.creatorName ? `Creator template · ${template.creatorName}` : 'Creator template',
    campaignCta: 'Use this free creator-led template in the app. No paid hosting, revenue-share, or partner tracking is attached.',
  };
}

export default function useCreateChallengeFlow({ onCreate, profile }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState(null);
  const [publishedCreatorTemplates, setPublishedCreatorTemplates] = useState([]);
  const [publishedCreatorTemplateMessage, setPublishedCreatorTemplateMessage] = useState('');
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

  useEffect(() => {
    let mounted = true;
    if (!user?.uid) return undefined;
    getPublishedCreatorChallengeTemplates()
      .then(templates => {
        if (!mounted) return;
        setPublishedCreatorTemplates((templates || []).map(normalizePublishedCreatorTemplate));
        setPublishedCreatorTemplateMessage('');
      })
      .catch(() => {
        if (!mounted) return;
        setPublishedCreatorTemplateMessage('Creator templates could not be loaded right now.');
      });
    return () => {
      mounted = false;
    };
  }, [user?.uid]);

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
    publishedCreatorTemplateMessage,
    publishedCreatorTemplates,
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
