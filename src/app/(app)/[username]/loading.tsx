import { ProfileSkeleton } from "@/components/ui/skeletons";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl border-x border-border">
      <ProfileSkeleton />
    </div>
  );
}
