'use client'

import { Profile } from "@/types/profile";
import { Startup } from "@/types/startup";
import { useState } from "react";
import CreateStartupForm from "@/app/(dashboard)/my-startup/(create-startup)/create-startup-form";
import ViewStartup from "@/app/(dashboard)/my-startup/(view-startup)/view-startup";

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
    return <ViewStartup startup={createdStartup} industries={[]} fundPool={null} />
  }

  // Otherwise render the create form
  return <CreateStartupForm profile={profile} onStartupCreated={handleStartupCreated} />
}