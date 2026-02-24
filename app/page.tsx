import { MainLayout } from "@/components/MainLayout";
import { NotificationPermissionModal } from "@/components/notifications/NotificationPermissionModal";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { InAppNotification } from "@/components/notifications/InAppNotification";

export default function Home() {
  return (
    <div className="h-screen w-full bg-black">
      <NotificationPermissionModal />
      <NotificationCenter />
      <InAppNotification />
      <MainLayout />
    </div>
  );
}
