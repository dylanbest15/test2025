import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CreateStartupWrapper from "@/app/(dashboard)/my-startup/(create-startup)/create-startup-wrapper"
import ViewStartup from "@/app/(dashboard)/my-startup/(view-startup)/view-startup"

export default async function MyStartup() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/sign-in")
  }

  const { data: profile, error } = await supabase.from("profiles").select().eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    // return notFound();
  }

  // If the user doesn't have a startup, render the create form
  if (!profile.startup_id) {
    return <CreateStartupWrapper profile={profile} />
  }

  // If the user has a startup, fetch and render it
  if (profile.startup_id) {
    const { data: startup, error: startupError } = await supabase
      .from("startups")
      .select()
      .eq("id", profile.startup_id)
      .single()

    if (startupError) {
      console.error("Error fetching startup:", startupError)
      // return notFound();
    }

    if (startup) {
      return <ViewStartup startup={startup} />
    }
  }
}