import Breadcrumb from "@/components/Breadcrumb";
import { fetchCurrentYear, fetchMonth } from "@/lib/_calendar";
import { useAppTime } from "@/hooks/useAppTime";

export default async function BreadcrumbWrapper() {
    const { getAppTime } = useAppTime();
    const today: Date = getAppTime();
    const day = today.getDate();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const month = await fetchMonth(monthName);
    const year = await fetchCurrentYear();
    // const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    // const date = `${month!.gameMonth} ${day}, ${year!.gameYear} ${year!.era} ${time}`;
    const staticDateInfo = {
        gameMonth: month!.gameMonth,
        gameYear: year!.gameYear,
        era: year!.era,
        day
    };

    // return <Breadcrumb inGameDate={date} />
    return <Breadcrumb staticDateInfo={staticDateInfo} />
}