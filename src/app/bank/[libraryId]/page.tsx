import { redirect } from 'next/navigation';

export default async function BankLibraryRedirect({
  params,
}: {
  params: Promise<{ libraryId: string }>;
}) {
  const { libraryId } = await params;
  redirect(`/academic/bank/${libraryId}`);
}
