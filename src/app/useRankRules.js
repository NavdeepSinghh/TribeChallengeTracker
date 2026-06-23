import { useEffect, useState } from "react";
import { DEFAULT_TRIBE_RANK_RULES, normalizeRankRules } from "../rankRules";
import { fetchRankRules } from "../userServices/rankRulesService";

export default function useRankRules() {
  const [rankRules, setRankRules] = useState(() => normalizeRankRules(DEFAULT_TRIBE_RANK_RULES));

  useEffect(() => {
    let mounted = true;
    fetchRankRules().then(rules => {
      if (mounted) setRankRules(rules);
    });
    return () => { mounted = false; };
  }, []);

  return rankRules;
}

