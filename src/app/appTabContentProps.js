export { buildBadgesTabProps } from './badgesTabProps';
export { buildBoardTabProps } from './boardTabProps';
export { buildChallengesTabProps } from './challengesTabProps';
export { buildHomeTabProps } from './homeTabProps';

import { buildBadgesTabProps } from './badgesTabProps';
import { buildBoardTabProps } from './boardTabProps';
import { buildChallengesTabProps } from './challengesTabProps';
import { buildHomeTabProps } from './homeTabProps';

export function buildAppTabContentProps(props) {
  return {
    badgesTabProps: buildBadgesTabProps(props),
    boardTabProps: buildBoardTabProps(props),
    challengesTabProps: buildChallengesTabProps(props),
    homeTabProps: buildHomeTabProps(props),
  };
}
