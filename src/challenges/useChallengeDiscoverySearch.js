import { useEffect, useRef, useState } from 'react';
import { searchPublicChallenges } from '../challengeService';
import { topDiscoverChallenges } from './challengeListModel';

export default function useChallengeDiscoverySearch({ joinedIds }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);

  const loadDiscover = async (term = '') => {
    setSearching(true);
    const results = await searchPublicChallenges(term);
    setSearchResults(topDiscoverChallenges(results, joinedIds, 3));
    setSearching(false);
  };

  useEffect(() => {
    loadDiscover(searchQuery.trim());
    return () => clearTimeout(searchTimer.current);
  }, [joinedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) {
      loadDiscover('');
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPublicChallenges(q);
      setSearchResults(topDiscoverChallenges(results, joinedIds, 3));
      setSearching(false);
    }, 350);
  };

  return {
    handleSearch,
    searchQuery,
    searchResults,
    searching,
  };
}
