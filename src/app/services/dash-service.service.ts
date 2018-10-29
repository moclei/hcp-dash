import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DashService {
  public toggleSidebar: EventEmitter<any> = new EventEmitter();
  public closeSidebar: EventEmitter<any> = new EventEmitter();
  constructor() { }

}
