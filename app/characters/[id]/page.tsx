import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { roles, userHasAccess } from "@/lib/roles";
import { fetchCharacter } from "@/lib/_characters";
import ViewCharacterTab from "@/app/characters/[id]/_components/ViewCharacterTab";

export default async function ViewCharacter({params}: {params: Promise<{id: string}>}) {
    const getID = (value: string): bigint => {
        const id = BigInt(value);
        if (!id) {
            redirect('/characters');
        }
        return id;
    }

    const id = getID((await params).id);
    const session = await auth();
    const character = await fetchCharacter(id);

    if (!character) redirect('/characters');

    if (!session?.user || (!userHasAccess(roles[4], session?.user) && (!character?.userId || character?.userId != session?.user?.id))) {
        redirect('/characters');
    }

    return (
        <ViewCharacterTab character={character} />
    );
}