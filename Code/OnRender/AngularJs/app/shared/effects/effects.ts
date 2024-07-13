// effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';

import {
    changeParkReserve
} from '../actions/actions';
import { ParkListServiceService } from '../../front-office/park-list/park-list-service.service';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private parkListService: ParkListServiceService
  ) {}

  changeParkReserve$ = createEffect(() => this.actions$.pipe(
    ofType(changeParkReserve),
    switchMap(() => this.parkListService.getAllReservedParks().pipe(
      map(parkList => console.log("Park List Effects = ", parkList)),
      catchError(error => of(loadDataFailure({ error })))
    ))
  ));

  /*getSpecificParkDetails$ = createEffect(() => this.actions$.pipe(
    ofType(loadInitialDataSuccess),
    concatMap(action => this.dataService.getAdditionalData(action.data).pipe(
      map(additionalData => loadAdditionalDataSuccess({ additionalData })),
      catchError(error => of(loadDataFailure({ error })))
    ))
  ));*/
}

function loadDataFailure(arg0: { error: any; }): any {
    throw new Error('Function not implemented.');
}
