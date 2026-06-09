import ChallengesTab from "../ChallengesTab";
import ProfileScreen from "../ProfileScreen";
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

  if (tab === "settings") {
    return (
      <ProfileScreen
        user={props.user}
        earnedBadges={props.earnedBadges}
        myHistory={props.myHistory}
        challengeStats={props.challengeStats}
        mode="settings"
        onProfileUpdated={props.setUserProfile}
        onHistoryUpdated={updated => {
          props.setMyHistory(updated);
          props.triggerBadgeCheck(updated, props.challengeStats);
        }}
        onClose={() => props.setTab("home")}
      />
    );
  }

  return null;
}
