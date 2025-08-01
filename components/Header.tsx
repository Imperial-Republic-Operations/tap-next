import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
import { getServerTranslations } from '@/lib/i18nServer';

function getNavigationConfig(t: any) {
    return {
        main: [
            { title: t.header.home, route: "/", exact: true, signInRequired: false, role: null, devOnly: false },
            { title: t.header.characters, route: "/characters", exact: false, signInRequired: true, role: roles[1], devOnly: false },
            { title: t.header.organizations, route: "/organizations", exact: false, signInRequired: false, role: null, devOnly: false },
            { title: t.header.documents, route: "/documents", exact: false, signInRequired: false, role: null, devOnly: false },
            { title: t.header.inventory, route: "/inventory", exact: false, signInRequired: true, role: roles[1], devOnly: false },
        ],
        dropdown: {
            title: t.header.more,
            sections: [
                {
                    label: t.header.administration,
                    items: [
                        { title: t.header.userAdministration, route: "/users", exact: false, signInRequired: true, role: roles[4], devOnly: false },
                        { title: t.header.calendarSettings, route: "/calendar", exact: false, signInRequired: true, role: roles[3], devOnly: false },
                        { title: t.header.notificationsTest, route: "/notifications/test", exact: false, signInRequired: true, role: roles[6], devOnly: true },
                    ]
                }
            ],
        }
    };
}

function getDropdownConfig(t: any) {
    return [
        { title: t.header.profile, route: "/profile", signInRequired: true },
        { title: t.header.settings, route: "/settings", signInRequired: true },
    ];
}

export default async function Header() {
    const {session, status} = await getSession();
    const t = await getServerTranslations(session?.user?.id);
    const navigationConfig = getNavigationConfig(t);
    const dropdown = getDropdownConfig(t);
    const allNavigationItems = [
        ...navigationConfig.main,
        ...navigationConfig.dropdown.sections.flatMap(section => section.items),
    ];
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

    const visibleDropdownSections = navigationConfig.dropdown.sections
        .map(section => ({
            ...section,
            items: section.items.filter(item => (!item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role, session?.user))) && ((item.devOnly && process.env.NODE_ENV !== "production") || !item.devOnly))
        }))
        .filter(section => section.items.length > 0);

    const hasVisibleDropdownItems = visibleDropdownSections.length > 0;

    return (
        <Disclosure as="nav" className="bg-white shadow-sm dark:bg-gray-800 dark:shadow-none">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton
                            className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:ring-2 focus:outline-hidden focus:ring-inset hover:bg-gray-700 hover:text-white focus:ring-white dark:hover:bg-gray-100 dark:hover:text-gray-500 dark:focus:ring-primary-500">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">{t.header.openMainMenu}</span>
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
                                {navigationConfig.main
                                    .filter((item) => (!item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role, session?.user))) && ((item.devOnly && process.env.NODE_ENV !== "production") || !item.devOnly))
                                    .map((item) => (
                                        <NavbarLink key={item.title} href={item.route} exact={item.exact}>
                                            {item.title}
                                        </NavbarLink>
                                    ))}

                                {hasVisibleDropdownItems && (
                                    <Menu as="div" className="relative">
                                        <MenuButton className="inline-flex items-center gap-x-1 text-sm font-medium px-3 py-2 border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 dark:hover:text-white dark:hover:bg-gray-700 text-gray-500 dark:rounded-md dark:text-gray-300 dark:border-none">
                                            {navigationConfig.dropdown.title}
                                            <ChevronDownIcon className="w-4 h-4" />
                                        </MenuButton>

                                        <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
                                            {visibleDropdownSections.map((section, sectionIdx) => (
                                                <div key={section.label}>
                                                    {sectionIdx > 0 && (
                                                        <div className="border-t border-gray-100 dark:border-gray-700" />
                                                    )}
                                                    {section.label && (
                                                        <div className="px-4 py-2">
                                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                                {section.label}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {section.items.map((item) => (
                                                        <MenuItem key={item.title}>
                                                            <a href={item.route} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                                                {item.title}
                                                            </a>
                                                        </MenuItem>
                                                    ))}
                                                </div>
                                            ))}
                                        </MenuItems>
                                    </Menu>
                                )}
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
                                        <span className="sr-only">{t.header.openCharacterMenu}</span>
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
                                    <span className="sr-only">{t.header.openUserMenu}</span>
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
                                    <form
                                        action={async () => {
                                            'use server'
                                            if (status === 'authenticated') return await signOut({ redirectTo: '/' });
                                            else return await signIn('nexus');
                                        }}>
                                        <button type="submit" className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden w-full text-left">
                                            {status === "authenticated" ? t.header.logout : t.header.login}
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
                    {allNavigationItems
                        .filter((item) => (!item.signInRequired || (item.signInRequired && status === "authenticated" && userHasAccess(item.role, session?.user))) && ((item.devOnly && process.env.NODE_ENV !== "production") || !item.devOnly))
                        .map((item) => (
                            <MobileNavbarLink key={item.title} href={item.route} exact={item.exact}>
                                {item.title}
                            </MobileNavbarLink>
                        ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}