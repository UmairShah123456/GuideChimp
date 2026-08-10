import { requireUser, getActiveAccount } from "@/lib/auth/session";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const account = await getActiveAccount();

  // Onboarding runs before an account exists, so it gets no chrome.
  if (!account) return <div className="min-h-dvh bg-page">{children}</div>;

  return (
    <DashboardChrome accountName={account.name} userEmail={user.email}>
      {children}
    </DashboardChrome>
  );
}
