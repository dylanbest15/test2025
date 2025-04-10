import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import SearchDemo from "@/components/custom/search-demo";
import { RoleToggle } from "@/components/auth/role-toggle";
import { SignupButton } from "@/components/auth/sign-up-button";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen h-screen overflow-hidden relative bg-[#f8f9fa]">
      <SearchDemo />
      {/* sign up - always visible */}
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
              Already have an account?{" "}
              <Link className="text-primary font-medium underline" href="/">
                Sign in
              </Link>
            </p>
            </div>
            {/* Client component with role toggle and messaging */}
            <RoleToggle />
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                minLength={6}
                required
              />
              <SignupButton formAction={signUpAction} pendingText="Signing up..." className="w-full">
                Sign up
              </SignupButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
