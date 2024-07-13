import { createAction, props } from "@ngrx/store";

export const changeLocation = createAction(
    '[Change] Location',
    props<{ position: { lat: number; lng: number }, city: string }>()
)

export const changeParkReserve = createAction(
    '[Change] Park Reserve',
    props<{ reserve: boolean }>()
)
