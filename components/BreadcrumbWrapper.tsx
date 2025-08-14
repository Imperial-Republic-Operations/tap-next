import { fetchCurrentYear, fetchMonth } from "@/lib/_calendar";
import { useAppTime } from "@/hooks/useAppTime";
import Breadcrumb from "@/components/Breadcrumb";

export default async function BreadcrumbWrapper() {
    const { getAppTime } = useAppTime();
    const today: Date = getAppTime();
    const day = today.getDate();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const month = await fetchMonth(monthName);
    const year = await fetchCurrentYear();

    const staticDateInfo = {
        gameMonth: month!.gameMonth,
        gameYear: year!.gameYear,
        era: year!.era,
        day
    };

    return <Breadcrumb staticDateInfo={staticDateInfo} />
}