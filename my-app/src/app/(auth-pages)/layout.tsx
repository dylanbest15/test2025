export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>{children}</div>
    // <div className="flex flex-col gap-12 pt-30 p-5 items-center">{children}</div>
  );
}
