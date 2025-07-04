import DocumentTab from "@/app/documents/_components/DocumentTab";
import { getSession } from "@/lib/auth";
import { roles, userHasAccess } from "@/lib/roles";

export default async function DocumentsHome() {
    const {session, status} = await getSession();
    return (
        <DocumentTab status={status} admin={userHasAccess(roles[4], session?.user)} />
    );
}