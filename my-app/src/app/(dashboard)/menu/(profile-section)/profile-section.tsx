import { Profile } from "@/types/profile";

interface ProfileSectionProps {
  profile: Profile;
}

type ProfileSheetType =
  | "name-and-bio"
  | "profile-picture"
  | "investor-industries"
  | null

export default function ProfileSection({ profile }: ProfileSectionProps) {

}