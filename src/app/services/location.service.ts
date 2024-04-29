import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Point} from "ol/geom";
import {SettingsService} from "./settings.service";
import {fromLonLat} from "ol/proj";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient, private settingsService: SettingsService) { }

  public async loadPoints(): Promise<Point[]> {
    const results: Point[] = [];
    const servers = this.settingsService.getServers();
    for (let i = 0; i < servers.length; i++) {
      if(servers[i].url === 'random'){
        results.push(new Point(fromLonLat([Math.random() * 90, Math.random() * 90])))
        continue;
      }

      try {
        let data = await this.http.get<any>(servers[i].url, httpOptions).toPromise();
        if (!data) {
          throw new Error("Cant get data");
        }

        const point = new Point(fromLonLat([data.lon, data.lat]));
        results.push(point);
      } catch (e) {}
    }

    return results;
  }
}
