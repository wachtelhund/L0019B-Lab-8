import L, { LatLngExpression } from "leaflet";

export const GAMMELSTAD: LatLngExpression = [65.64563456606706, 22.03028804984905];
export const LAYERS = {
    NONE: L.tileLayer(''),
    OSM: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }),
    HOT: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'}),
    ESRI: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: '© Esri'}),

}
export const TOGGLE_LAYERS = {
    Gammelstad: L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
        layers: 'lab8_2:gammelstad',
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        attribution: 'Gammelstad'
    }),
    Kollektivtrafik: L.tileLayer.wms('http://localhost:8080/geoserver/wms', {
        layers: 'busline:kollektiv',
        format: 'image/png',
        transparent: true,
        version: '1.1.0',
        attribution: 'Busline'
    })
}