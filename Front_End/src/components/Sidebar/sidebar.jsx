import React from "react";
import { RouteSelect } from "./routeselect";
import { Plan } from "./plan";

export const Sidebar = () => {

    return (
        <div className="mt-24">
            <div className="sticky top-4 h-[calc(82vh-48px)]">
                <RouteSelect />
            </div>

            <Plan />
        </div>
    )
}