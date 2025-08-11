import { getSession } from "@/lib/auth";
import PoliticsDashboard from "@/app/politics/_components/PoliticsDashboard";

export default async function PoliticsHome() {
    const { session } = await getSession();

    return (
        <PoliticsDashboard userId={session?.user?.id} />
    );
}