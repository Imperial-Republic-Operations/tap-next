import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { roles, userHasAccess } from "@/lib/roles";
import { cookies } from "next/headers";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import ActiveCharacterSelector from "@/components/ActiveCharacterSelector";
import NavbarLink from "@/components/NavbarLink";
import MobileNavbarLink from "@/components/MobileNavbarLink";
import { fetchUnreadNotificationCount } from "@/lib/_notifications";
import NotificationBell from "@/components/NotificationBell";
import { getSession } from "@/lib/auth";

const navigation = [
    { title: "Home", route: "/", exact: true, signInRequired: false, role: null },
    { title: "Characters", route: "/characters", exact: false, signInRequired: true, role: roles[1] },
    { title: "Organizations", route: "/organizations", exact: false, signInRequired: false, role: null },
    { title: "Inventory", route: "/inventory", exact: false, signInRequired: true, role: roles[1] },
    { title: "Documents", route: "/documents", exact: false, signInRequired: false, role: null },
    { title: "User Administration", route: "/users", exact: false, signInRequired: true, role: roles[3] },
    { title: "Calendar Settings", route: "/calendar", exact: false, signInRequired: true, role: roles[3] },
    { title: "Notifications Test", route: "/notifications/test", exact: false, signInRequired: true, role: roles[6] },
];

const dropdown = [
    { title: "Profile", route: "/profile", signInRequired: true },
    { title: "Settings", route: "/settings", signInRequired: true },
];

export default async function Header() {
    const {session, status} = await getSession();
    let characters: { id: bigint, name: string, avatarLink: string | null }[] = [];
    let activeCharacter: { id: bigint, name: string, avatarLink: string | null } | undefined = undefined;
    let hasNotifications = false;

    if (session?.user) {
        characters = await prisma.character.findMany({
            where: { userId: session.user.id },
            select: {
                id: true,
                name: true,
                avatarLink: true,
            }
        });

        hasNotifications = (await fetchUnreadNotificationCount(session.user.id!)) > 0;

        const cookieStore = await cookies();
        const activeCharacterId = cookieStore.get("activeCharacterId")?.value;

        if (activeCharacterId) {
            activeCharacter = characters.find(c => c.id.toString() === activeCharacterId);
        } else {
            const userSettings = await prisma.userSettings.findUnique({
                where: { userId: session.user.id },
                select: {
                    defaultCharacter: {
                        select: {
                            id: true,
                            name: true,
                            avatarLink: true,
                        }
                    },
                },
            });

            if (userSettings?.defaultCharacter) {
                activeCharacter = userSettings.defaultCharacter;
            }
        }
    }

    return (
        <Disclosure as="nav" className="bg-white shadow-sm dark:bg-gray-800 dark:shadow-none">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton
                            className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:ring-2 focus:outline-hidden focus:ring-inset hover:bg-gray-700 hover:text-white focus:ring-white dark:hover:bg-gray-100 dark:hover:text-gray-500 dark:focus:ring-primary-500">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <img className="h-8 w-auto"
                                 src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=violet&shade=600"
                                 alt="Terminal Access Project" />
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {navigation
                                    .filter((item) => !item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role, session?.user)))
                                    .map((item) => (
                                        /*<a key={item.title} href={item.route} aria-current={isCurrentPage(pathname, item.route, item.exact) ? 'page' : undefined} className={classNames(isCurrentPage(pathname, item.route, item.exact) ? 'border-primary-500 text-gray-900 dark:bg-gray-900 dark:text-white' : 'border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white dark:hover:bg-gray-700', 'text-sm font-medium px-3 py-2 border-b-2 text-gray-500 dark:rounded-md dark:text-gray-300 dark:border-none')}>
                                            {item.title}
                                        </a>*/
                                        <NavbarLink key={item.title} href={item.route} exact={item.exact}>
                                            {item.title}
                                        </NavbarLink>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <NotificationBell loggedIn={status === 'authenticated'} hasNotifications={hasNotifications} />

                        {status === "authenticated" && (
                            <Menu as="div" className="relative ml-3">
                                <div>
                                    <MenuButton
                                        className="relative flex rounded-full text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden bg-gray-800 focus:ring-white focus:ring-offset-gray-800 dark:bg-white dark:focus:ring-primary-500">
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open character menu</span>
                                        {characters.length > 0 && activeCharacter ? (
                                            <img
                                                id="character-avatar"
                                                className="size-8 rounded-full"
                                                src={activeCharacter.avatarLink ?? 'https://images.eotir.com/avatars/fnf.jpg'}
                                                alt={activeCharacter.name} />
                                        ) : (
                                            <span
                                                className="inline-block size-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                            <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                        )}
                                    </MenuButton>
                                </div>
                                {characters.length > 0 && (
                                    <MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                                        {characters.map((character) => (
                                            <MenuItem key={character.id}>
                                                <ActiveCharacterSelector characterId={character.id}>
                                                    {character.name}
                                                </ActiveCharacterSelector>
                                            </MenuItem>
                                        ))}
                                    </MenuItems>
                                )}
                            </Menu>
                        )}

                        <Menu as="div" className="relative ml-3">
                            <div>
                                <MenuButton
                                    className="relative flex rounded-full text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden bg-gray-800 focus:ring-white focus:ring-offset-gray-800 dark:bg-white dark:focus:ring-primary-500">
                                    <span className="absolute -inset-1.5"></span>
                                    <span className="sr-only">Open user menu</span>
                                    {status === "authenticated" ? (
                                        <img
                                            className="size-8 rounded-full"
                                            src={session?.user?.image ?? 'https://images.eotir.com/avatars/fnf.jpg'}
                                            alt={session?.user?.name ?? 'User'}
                                        />
                                    ) : (
                                        <span
                                            className="inline-block size-8  overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                                            <svg className="size-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                    )}
                                </MenuButton>
                            </div>
                            <MenuItems transition className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                                {dropdown.filter((item) => !item.signInRequired || (item.signInRequired && status === "authenticated")).map((item) => (
                                    <MenuItem key={item.title}>
                                        <a href={item.route} className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left">
                                            {item.title}
                                        </a>
                                    </MenuItem>
                                ))}
                                <MenuItem>
                                    <form action={async () => { "use server"; status === "authenticated" ? await signOut({ redirectTo: "/" }) : await signIn("nexus")}}>
                                        <button type="submit" className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left">
                                            {status === "authenticated" ? "Logout" : "Login"}
                                        </button>
                                    </form>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <MobileNavbarLink key={item.title} href={item.route} exact={item.exact}>
                            {item.title}
                        </MobileNavbarLink>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}