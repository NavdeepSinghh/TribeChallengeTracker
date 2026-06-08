import { useEffect } from 'react';
import { loadProfileScreenData } from './loadProfileScreenData';

export default function useProfileScreenDataLoader(user, loadTargets) {
  useEffect(() => {
    loadProfileScreenData(user.uid, loadTargets);
  }, [user.uid, ...Object.values(loadTargets)]);
}
