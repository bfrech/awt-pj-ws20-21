import { Injectable } from '@angular/core';
import * as dashjs from 'dashjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // tslint:disable-next-line:variable-name
  private readonly _player: dashjs.MediaPlayerClass;

  constructor() {
    this._player = dashjs.MediaPlayer().create();
  }

  /** Getter for dashjs player object */
  get player(): dashjs.MediaPlayerClass {
    return this._player;
  }

  /** Stop player by unloading source */
  stop(): void {
    this._player.attachSource('');
  }

  /** Load source */
  load(streamAddr: string | undefined): void {
    this._player.attachSource(streamAddr);
  }

  /** Provide metrics */
  getMetrics(): number {
    const metrics = this._player.getDashMetrics();
    // let state: dashjs.IBufferState | undefined = metrics?.getCurrentBufferState('video');
    return metrics?.getCurrentBufferLevel('video');
  }

}
