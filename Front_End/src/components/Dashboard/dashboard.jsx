import React from "react";
import { Topbar } from "./topbar";
import { Grid } from "./grid";

export const Dashboard = () => {

    return (
        <div className="rounded-lg bg-white pb-3 shadow h[200vh] mt-20" >
            <Topbar />
            <Grid />
        </div>
    )
}