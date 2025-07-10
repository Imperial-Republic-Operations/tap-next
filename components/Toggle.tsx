'use client'

import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "@/lib/style";

interface ToggleProps {
    name: string;
    disabled?: boolean;
}

export default function Toggle({name, disabled = false}: ToggleProps) {
    const {register, setValue, watch} = useFormContext();
    const enabled = watch(name);

    useEffect(() => {
        register(name);
    }, [register, name]);

    return(
        <Switch
            checked={enabled}
            onChange={(checked) => !disabled && setValue(name, checked)}
            disabled={disabled}
            className={classNames(disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-gray-200 data-checked:bg-primary-600', 'group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-hidden')}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={classNames(disabled ? 'bg-gray-200' : 'bg-white', 'pointer-events-none inline-block size-5 transform rounded-full shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5')}
            />
        </Switch>
    )
}