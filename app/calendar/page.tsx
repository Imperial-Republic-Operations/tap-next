import MonthsList from "@/app/calendar/_components/MonthsList";
import { auth } from "@/auth";
import { roles, userHasAccess } from "@/lib/roles";
import YearList from "@/app/calendar/_components/YearList";

export default async function Calendar() {
    const session = await auth();

    return (
        <div className="w-full grid grid-cols-2 gap-10 p-3">
            <MonthsList admin={userHasAccess(roles[5], session?.user)} />
            <YearList admin={userHasAccess(roles[4], session?.user)} moderator={userHasAccess(roles[3], session?.user)} />
        </div>
    );
}