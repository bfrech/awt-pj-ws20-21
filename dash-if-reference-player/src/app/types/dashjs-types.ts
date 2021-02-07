import * as dashjs from 'dashjs';

/** Augment dashjs in order to add or change it's declarations */
declare module 'dashjs' {

  // Add missing declarations of required DashAdapter methods
  export interface DashAdapter {
    getPeriodById(id: string): object;
  }
}
