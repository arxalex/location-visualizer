import { Injectable } from '@angular/core';
import {Server} from "../models/server";

const SERVER = "SERVER_"
const LASTITEM = "LASTSERVERID" // from 1
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() {
    const lastItem = window.sessionStorage.getItem(LASTITEM);
    if(!lastItem || Number(lastItem) < 1){
      window.sessionStorage.setItem(LASTITEM, '0')
    }
  }

  public clearStorage(): void {
    window.sessionStorage.clear();
  }

  public saveServer(server: Server): void {
    window.sessionStorage.setItem(SERVER + server.id, server.url);
    if(server.id >= this.getId()){
      window.sessionStorage.setItem(LASTITEM, server.id.toString())
    }
  }

  public saveServers(servers: Server[]){
    const savedServers = this.getServers();
    savedServers.forEach(server => {
      if(!servers.map(e => e.id).includes(server.id)){
        this.removeServer(server);
      }
    })
    servers.forEach(server => this.saveServer(server));
    if(servers.length === 0){
      window.sessionStorage.setItem(LASTITEM, '0');
    }
  }

  public getServers(): Server[] {
    const lastId = this.getId() - 1;
    const result: Server[] = [];
    for (let i = 1; i <= lastId; i++){
      const url = window.sessionStorage.getItem(SERVER + i);
      if(url !== null) {
        const server: Server = {
          id: i,
          url: url
        }
        result.push(server)
      }
    }

    return result;
  }

  public removeServer(server: Server){
    window.sessionStorage.removeItem(SERVER + server.id);
  }

  public getId(): number {
    return Number(window.sessionStorage.getItem(LASTITEM)) + 1;
  }
}
