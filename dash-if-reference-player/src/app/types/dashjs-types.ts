import * as dashjs from 'dashjs';

/** Augment dashjs in order to add or change it's declarations */
declare module 'dashjs' {

  export interface Period {
    id: string;
    index: number;
    duration: number;
    start: number;
    mpd: object;
  }

  export interface DashAdapter {
    getPeriodById(id: string): (Period | null);
  }
}
