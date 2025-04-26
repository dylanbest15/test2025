'use client'

import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";
import { useState } from "react";
import MyStartupView from "@/app/(dashboard)/my-startup/my-startup-view";
import CreateStartupForm from "@/app/(dashboard)/my-startup/(create-startup)/create-startup-form";

interface CreateStartupWrapperProps {
  profile: Profile;
}

export default function CreateStartupWrapper({ profile }: CreateStartupWrapperProps) {
  const [createdStartup, setCreatedStartup] = useState<Startup | null>(null)

  const handleStartupCreated = (startup: Startup) => {
    setCreatedStartup(startup)
  }

  // If a startup was created, render the view component
  if (createdStartup) {
    return <MyStartupView startup={createdStartup} />
  }

  // Otherwise render the create form
  return <CreateStartupForm profile={profile} onStartupCreated={handleStartupCreated} />
}