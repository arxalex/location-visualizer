import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SettingsService} from "../services/settings.service";
import {Server} from "../models/server";

@Component({
  selector: 'app-settings-popup',
  templateUrl: './settings-popup.component.html',
  styleUrl: './settings-popup.component.css'
})
export class SettingsPopupComponent implements OnInit{
  @Output() closeSettings: EventEmitter<void> = new EventEmitter<void>();
  protected servers: Server[] = [];
  constructor(private settingsService: SettingsService) {
  }

  ngOnInit(){
    if(this.settingsService.getId() > 1) {
      this.servers = this.settingsService.getServers();
    } else {
      this.addServer();
    }
  }

  addServer() {
    this.servers.push({
      id: this.getLastId(),
      url: ''
    });
  }

  saveServers() {
    this.settingsService.saveServers(this.servers);
    this.closeSettings.emit();
  }

  removeServer(server: Server) {
    this.servers.splice(this.servers.findIndex(e => e.id === server.id), 1);
  }

  getLastId(){
    if(this.servers.length > 0){
      return Math.max(...this.servers.map(e => e.id)) + 1;
    } else {
      return 1;
    }
  }
}
