import { fetchUniqueCharacterCount } from "@/lib/_organizations";

type SuborganizationData = {
  id: bigint;
  name: string;
  abbreviation: string;
  members: any[];
};

interface SuborganizationsListProps {
    subOrgs: SuborganizationData[];
}

export default async function SuborganizationsList({ subOrgs }: SuborganizationsListProps) {
    const childrenWithTotalMembers = await Promise.all(
        subOrgs.map(async (child) => {
            const totalMembers = await fetchUniqueCharacterCount(child.id);
            return { ...child, totalMembers, directMembers: child.members.length };
        })
    );

    return (
        <ul className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {childrenWithTotalMembers.map((sub) => (
                <li key={sub.id} className="col-span-1 flex rounded-md shadow-xs">
                    <div className="flex w-16 shrink-0 items-center justify-center rounded-l-md bg-violet-600 text-sm font-medium text-white">
                        {sub.abbreviation.substring(0, 5)}
                    </div>
                    <div
                        className="flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex-1 truncate px-4 py-2 text-sm">
                            <a href={`/organizations/${sub.id}`}
                               className="font-medium text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">{sub.name}</a>
                            <p className="text-gray-500">
                                {sub.totalMembers} Member{sub.totalMembers !== 1 ? "s" : ""}
                                {sub.totalMembers !== sub.directMembers && (
                                    <span className="text-xs ml-1">
                                        ({sub.directMembers} direct)
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}