import Breadcrumb from "@/components/Breadcrumb";
import { fetchCurrentYear, fetchMonth } from "@/lib/_calendar";

export default async function BreadcrumbWrapper() {
    const today: Date = new Date();
    const day = today.getDate();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const month = await fetchMonth(monthName);
    const year = await fetchCurrentYear();

    const date = `${month!.gameMonth} ${day}, ${year!.gameYear} ${year!.era}`;

    return <Breadcrumb inGameDate={date} />
}