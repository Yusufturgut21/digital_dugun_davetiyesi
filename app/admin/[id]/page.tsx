import { redirect } from "next/navigation";

export default function OldEditAdminPage({ params }: { params: { id: string } }) {
  redirect(`/admin/couples/${params.id}`);
}
