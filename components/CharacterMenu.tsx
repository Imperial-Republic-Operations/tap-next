'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import ActiveCharacterSelector from "@/components/ActiveCharacterSelector";

interface Character {
    id: bigint;
    name: string;
    avatarLink: string | null;
}

interface CharacterMenuProps {
    characters: Character[];
    activeCharacter?: Character;
    openCharacterMenuText: string;
}

export default function CharacterMenu({ characters, activeCharacter, openCharacterMenuText }: CharacterMenuProps) {
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <MenuButton
                    className="relative flex rounded-full text-sm focus:ring-2 focus:ring-offset-2 focus:outline-hidden bg-gray-800 focus:ring-white focus:ring-offset-gray-800 dark:bg-white dark:focus:ring-primary-500">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">{openCharacterMenuText}</span>
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
                            {({ close }) => (
                                <ActiveCharacterSelector characterId={character.id} close={close}>
                                    {character.name}
                                </ActiveCharacterSelector>
                            )}
                        </MenuItem>
                    ))}
                </MenuItems>
            )}
        </Menu>
    );
}