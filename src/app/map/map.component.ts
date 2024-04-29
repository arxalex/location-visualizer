import {AfterViewInit, Component, OnInit} from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {Feature} from "ol";
import {Point} from "ol/geom";
import {Vector} from 'ol/layer';
import {Vector as VectorS} from 'ol/source';
import {LocationService} from "../services/location.service";
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  public map!: Map
  private features: Array<Feature<Point>> = [];
  private marker: Vector<VectorS<Feature<Point>>> = new Vector({
    source: new VectorS({
      features: this.features
    })
  });

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,maxZoom: 18,
      }),
    });

    this.map.addLayer(this.marker);
  }

  ngAfterViewInit() {
    setInterval(async () => {
      const points = await this.locationService.loadPoints();
      this.removePoints();
      this.addPoints(points);
    }, 1000);
  }


  removePoints() {
    this.marker.getSource()?.removeFeatures(this.features);
    this.features = [];
  }

  addPoints(points: Point[]) {
    points.forEach(point => this.features.push(
      new Feature({
        geometry: point
      })
    ));
    this.marker.getSource()?.addFeatures(this.features);
  }

  addPoint(point: Point) {
    let feature = new Feature({geometry: point});
    this.features.push(feature);
    this.marker.getSource()?.addFeature(feature);
  }
}
