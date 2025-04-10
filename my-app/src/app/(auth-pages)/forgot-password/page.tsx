import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/auth/form-message";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        <form className="md:bg-card rounded-lg md:shadow-md md:border md:border-border/40 p-10 py-12 space-y-8 relative overflow-hidden">
          <div className="text-center pb-2">
            <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link className="text-primary font-medium hover:underline" href="/">
                Sign in
              </Link>
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="w-full" />
            </div>
            <SubmitButton formAction={forgotPasswordAction} className="w-full">
              Reset Password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
