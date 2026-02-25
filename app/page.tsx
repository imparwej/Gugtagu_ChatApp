"use client";

import React from "react";
import { useChatStore } from "@/store/chatStore";
import { QRLoginScreen } from "@/components/auth/QRLoginScreen";
import { MainLayout } from "@/components/MainLayout";
import { InAppNotification } from "@/components/notifications/InAppNotification";

export default function Home() {
  const { isLoggedIn } = useChatStore();

  if (!isLoggedIn) {
    return <QRLoginScreen />;
  }

  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <InAppNotification />
      <MainLayout />
    </div>
  );
}
