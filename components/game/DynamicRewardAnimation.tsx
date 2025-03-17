import dynamic from "next/dynamic";
import { RewardAnimationProps } from "./animations/types";

// Dynamically import the RewardAnimation component with SSR disabled
const DynamicRewardAnimation = dynamic(() => import("./RewardAnimation"), {
  ssr: false,
});

export default function RewardAnimationWrapper(props: RewardAnimationProps) {
  return <DynamicRewardAnimation {...props} />;
}
