import { Action, createReducer, on } from '@ngrx/store';
import { changeLocation, changeParkReserve } from '../actions/actions';
import { State,initialState } from '../store/state';

const _changeReducer = createReducer(
    initialState,
    on(changeLocation, (state, { position, city }) => ({ ...state, position, city })),
    on(changeParkReserve, (state, { reserve } ) => ({ ...state, reserve }))
);

export function changeReducer(state: State | undefined, action: Action){
    return _changeReducer(state, action)
}

