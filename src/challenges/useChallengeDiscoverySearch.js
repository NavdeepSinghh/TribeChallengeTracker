import { useRef, useState } from 'react';
import { searchPublicChallenges } from '../challengeService';

export default function useChallengeDiscoverySearch({ joinedIds }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);

  const handleSearch = (q) => {
    setSearchQuery(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPublicChallenges(q);
      setSearchResults(results.map(c => ({ ...c, alreadyJoined: joinedIds.has(c.id) })));
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
