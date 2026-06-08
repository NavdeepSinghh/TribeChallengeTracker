import ChallengesTab from "../ChallengesTab";
import BadgesTab from "./BadgesTab";
import BoardTab from "./BoardTab";
import HomeTab from "./HomeTab";
import { buildAppTabContentProps } from "./appTabContentProps";

export function renderAppTabContent({ tab, ...props }) {
  const {
    badgesTabProps,
    boardTabProps,
    challengesTabProps,
    homeTabProps,
  } = buildAppTabContentProps(props);

  if (tab === "home") {
    return <HomeTab {...homeTabProps} />;
  }

  if (tab === "board") {
    return <BoardTab {...boardTabProps} />;
  }

  if (tab === "badges") {
    return <BadgesTab {...badgesTabProps} />;
  }

  if (tab === "challenges") {
    return <ChallengesTab {...challengesTabProps} />;
  }

  return null;
}
