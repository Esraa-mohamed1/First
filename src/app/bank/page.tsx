import { redirect } from 'next/navigation';

export default async function BankPageRedirect() {
  redirect('/academic/bank');
}
