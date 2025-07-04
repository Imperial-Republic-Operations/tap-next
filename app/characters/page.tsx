import { roles, userHasAccess } from "@/lib/roles";
import CharacterTab from "@/app/characters/_components/CharacterTab";
import { getSession } from "@/lib/auth";

export default async function CharactersHome() {
    const { session } = await getSession();

    return (
        <CharacterTab userId={session!.user!.id!} admin={userHasAccess(roles[3], session?.user)} />
    );
}