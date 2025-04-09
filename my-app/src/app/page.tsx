// import { Button } from "@/components/ui/button";
import SearchDemo from "@/components/custom/search-demo";
import Link from "next/link";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function Home(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <main className="flex min-h-screen h-screen overflow-hidden relative">
      <SearchDemo />

      {/* Fund Pool info - always visible */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center flex-shrink-0">
        <div className="max-w-md">
          <h1 className="mb-2 text-4xl font-medium text-gray-900">The Fund Pool</h1>
          <p className="mb-8 text-gray-600">The new hub for startups and investors.</p>

          <div className="mb-8 h-px w-full bg-gray-200" />

          {/* <p className="mb-6 text-gray-700">
            Join as a startup and connect with investors. Join as an investor and connect with startups.
          </p> */}

          <form className="flex-1 flex flex-col min-w-64">
            {/* <h1 className="text-2xl font-medium">Sign in</h1> */}
            <p className="text-sm text-foreground">
              Don't have an account?{" "}
              <Link className="text-foreground font-medium underline" href="/sign-up">
                Sign up
              </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="email">Email</Label>
              <Input name="email" placeholder="you@example.com" required />
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-foreground underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                name="password"
                placeholder="Your password"
                required
              />
              <SubmitButton pendingText="Signing In..." formAction={signInAction}>
                Sign in
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>

          {/* <div className="flex flex-wrap gap-4">
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div> */}
        </div>
      </div>
    </main>

  );
}
