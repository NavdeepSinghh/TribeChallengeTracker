import { useRef, useState } from 'react';
import { getDailyReminderLabel } from '../reminderService';

export default function useProfileEngagementState(user) {
  const [instagramHandle, setInstagramHandle] = useState('');
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialMessage, setSocialMessage] = useState('');
  const [featureCategory, setFeatureCategory] = useState('streak_win');
  const [featureStory, setFeatureStory] = useState('');
  const [featureMediaData, setFeatureMediaData] = useState('');
  const [featureConsent, setFeatureConsent] = useState(false);
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false);
  const [featureMessage, setFeatureMessage] = useState('');
  const [featureSubmissions, setFeatureSubmissions] = useState([]);
  const [featuredSubmissions, setFeaturedSubmissions] = useState([]);
  const [featureReviewQueue, setFeatureReviewQueue] = useState([]);
  const [featureReviewNotes, setFeatureReviewNotes] = useState({});
  const [winCardMessage, setWinCardMessage] = useState('');
  const [reminderLabel, setReminderLabel] = useState(getDailyReminderLabel());
  const [reminderError, setReminderError] = useState('');
  const fileInputRef = useRef(`profile-photo-${user.uid}`);
  const featureFileInputRef = useRef(`feature-photo-${user.uid}`);

  return {
    featureCategory,
    featureConsent,
    featureFileInputRef,
    featureMediaData,
    featureMessage,
    featureReviewNotes,
    featureReviewQueue,
    featureStory,
    featureSubmissions,
    featuredSubmissions,
    fileInputRef,
    instagramHandle,
    isSavingSocial,
    isSubmittingFeature,
    reminderError,
    reminderLabel,
    setFeatureCategory,
    setFeatureConsent,
    setFeatureMediaData,
    setFeatureMessage,
    setFeatureReviewNotes,
    setFeatureReviewQueue,
    setFeatureStory,
    setFeatureSubmissions,
    setFeaturedSubmissions,
    setInstagramHandle,
    setIsSavingSocial,
    setIsSubmittingFeature,
    setReminderError,
    setReminderLabel,
    setSocialMessage,
    setWinCardMessage,
    socialMessage,
    winCardMessage,
  };
}
