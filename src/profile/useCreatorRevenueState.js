import { useState } from 'react';

export default function useCreatorRevenueState() {
  const [creatorEnabled, setCreatorEnabled] = useState(false);
  const [creatorSpecialty, setCreatorSpecialty] = useState('');
  const [creatorBio, setCreatorBio] = useState('');
  const [creatorCtaUrl, setCreatorCtaUrl] = useState('');
  const [creatorRevenueShareInterest, setCreatorRevenueShareInterest] = useState(false);
  const [creatorMessage, setCreatorMessage] = useState('');
  const [isSavingCreator, setIsSavingCreator] = useState(false);
  const [creatorRevenueShareSummary, setCreatorRevenueShareSummary] = useState({});
  const [creatorHostingApplicationReviewQueue, setCreatorHostingApplicationReviewQueue] = useState([]);
  const [creatorHostingApplicationMessage, setCreatorHostingApplicationMessage] = useState('');
  const [isSubmittingCreatorHostingApplication, setIsSubmittingCreatorHostingApplication] = useState(false);
  const [creatorHostingApplicationReviewNotes, setCreatorHostingApplicationReviewNotes] = useState({});
  const [reviewingCreatorHostingApplicationId, setReviewingCreatorHostingApplicationId] = useState('');

  return {
    creatorBio,
    creatorCtaUrl,
    creatorEnabled,
    creatorHostingApplicationMessage,
    creatorHostingApplicationReviewNotes,
    creatorHostingApplicationReviewQueue,
    creatorMessage,
    creatorRevenueShareInterest,
    creatorRevenueShareSummary,
    creatorSpecialty,
    isSavingCreator,
    isSubmittingCreatorHostingApplication,
    reviewingCreatorHostingApplicationId,
    setCreatorBio,
    setCreatorCtaUrl,
    setCreatorEnabled,
    setCreatorHostingApplicationMessage,
    setCreatorHostingApplicationReviewNotes,
    setCreatorHostingApplicationReviewQueue,
    setCreatorMessage,
    setCreatorRevenueShareInterest,
    setCreatorRevenueShareSummary,
    setCreatorSpecialty,
    setIsSavingCreator,
    setIsSubmittingCreatorHostingApplication,
    setReviewingCreatorHostingApplicationId,
  };
}
