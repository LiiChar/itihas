import { getMonth } from "@/shared/lib/data"
import Snowing from "../widget/effects/Snowing"
import { ReactNode } from "react";

const event: { [key: string]: ReactNode | null } = {
    1: <Snowing/>,
    2: <Snowing/>,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: <Snowing/>,
}

export const TimeEvents = () => {
  return (
    <>
     {event[getMonth()]}
    </>
  )
}
