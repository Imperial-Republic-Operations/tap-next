'use client'

import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";

interface ToggleProps {
    name: string;
}

export default function Toggle({name}: ToggleProps) {
    const {register, setValue, watch} = useFormContext();
    const enabled = watch(name);

    useEffect(() => {
        register(name);
    }, [register, name]);

    return(
        <Switch
            checked={enabled}
            onChange={(checked) => setValue(name, checked)}
            className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-primary-600"
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
            />
        </Switch>
    )
}