import MonthsList from "@/app/calendar/_components/MonthsList";
import { auth } from "@/auth";
import { roles, userHasAccess } from "@/lib/roles";
import YearList from "@/app/calendar/_components/YearList";
import ErrorBoundary, { CalendarErrorFallback } from "@/components/ErrorBoundary";

export default async function Calendar() {
    const session = await auth();
    const isMonthAdmin = userHasAccess(roles[5], session?.user);
    const isYearAdmin = userHasAccess(roles[4], session?.user);
    const isYearMod = userHasAccess(roles[3], session?.user);

    return (
        <div className="w-full grid grid-cols-2 gap-10 p-3">
            <ErrorBoundary fallback={CalendarErrorFallback}>
                <MonthsList admin={isMonthAdmin} />
            </ErrorBoundary>

            <ErrorBoundary fallback={CalendarErrorFallback}>
                <YearList admin={isYearAdmin} moderator={isYearMod} />
            </ErrorBoundary>
        </div>
    );
}