import FactionList from "@/app/organizations/_components/FactionList";
import { getSession } from "@/lib/auth";

export default async function OrganizationsHome() {
    const { status } = await getSession();

    return (
        <FactionList status={status} />
    );
}