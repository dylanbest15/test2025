import SearchDemo from "@/components/app-shell/search-demo";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Home(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <main className="flex min-h-screen h-screen overflow-hidden relative bg-[#f8f9fa]">
      <SearchDemo />
      {/* sign in - always visible */}
      <div className="w-full md:w-1/2 p-3 md:p-10 flex items-center justify-center flex-shrink-0">
        <div className="max-w-md w-full">
          <form className="md:bg-card rounded-lg md:shadow-md md:border md:border-border/40 p-10 py-12 space-y-8 relative overflow-hidden">
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-medium text-gray-900">The Fund Pool</h1>
                {/* <p className="mt-2 text-gray-600">The new hub for startups and investors.</p> */}
              </div>
              <div className="h-px w-full bg-gray-200/70" />
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{" "}
                <Link className="text-primary font-medium underline" href="/sign-up">
                  Sign up
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" placeholder="you@example.com" required />
                  <Label htmlFor="password">Password</Label>
                  <Link className="text-xs text-primary hover:underline" href="/forgot-password">
                    Forgot Password?
                  </Link>
                <Input id="password" type="password" name="password" placeholder="Your password" required />
              <SubmitButton pendingText="Signing In..." formAction={signInAction} className="w-full">
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
