import * as L from 'leaflet';
import * as CONSTANTS from './constants';

const map = L.map('map').setView(CONSTANTS.GAMMELSTAD, 16);
CONSTANTS.LAYERS.HOT.addTo(map);
L.control.layers(CONSTANTS.LAYERS, CONSTANTS.TOGGLE_LAYERS).addTo(map);

// @ts-ignore
const legendControl = L.control({position: 'bottomleft'});
legendControl.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Legend</h4>";
    div.innerHTML += '<i style="background: #707070"></i><span>Fastighetsgänser</span><br>';
    div.innerHTML += '<i style="background: #d0fbbf"></i><span>Inventerade Hus</span><br>';
    div.innerHTML += '<i style="background: #c03030"></i><span>Vägkonturer</span><br>';
    div.innerHTML += '<i style="background: #6699ff"></i><span>Busslinjer</span><br>';
    div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Tåglinjer</span><br>';

    return div;
};
legendControl.addTo(map);

map.on('click', function(e) {
    const latlng = e.latlng;
    
    const url = getFeatureInfoUrl(latlng);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if ((data as any).features.length > 0) {
                const feature = (data as any).features[0].properties;
                let content = ``;
                
                if (feature.BID) {
                    const url = `../assets/Assets/Hus/inv/${feature.BID.toLowerCase()}.html`;
                    fetch(url).then(response => {
                        if (response.status === 200) {
                            content += `<iframe src="${url}" style="width: 100%; height: 100%;"></iframe>`
                        } else if (response.status === 404) {
                            throw new Error('No content');
                        }
                        openPopup(latlng, content);
                    }).catch(err => {
                        if (content === '') {
                            content = '<table class="popup-table">';
                            for (const key in feature) {
                                content += `<tr class=row><td>${key}</td><td>${feature[key]}</td></tr>`;
                            }
                            content += '</table>';
                            openPopup(latlng, content);
                        } else {
                            openPopup(latlng, content);
                        }
                    });
                }
            }
        });
});

function getFeatureInfoUrl(latlng: L.LatLng): string {
    const crs = L.CRS.EPSG3857;
    const mapSize = map.getSize();
    const mapBounds = map.getBounds();
    const point = map.latLngToContainerPoint(latlng);

    const sw = crs.project(mapBounds.getSouthWest());
    const ne = crs.project(mapBounds.getNorthEast());
    const bbox = [sw.x, sw.y, ne.x, ne.y].join(',');

    const baseUrl = 'http://localhost:8080/geoserver/wms';
    const baseParams: {
        [key: string]: string | number;
        service: string;
        version: string;
        request: string;
        layers: string;
        bbox: string;
        width: number;
        height: number;
        query_layers: string;
        info_format: string;
        srs: string;
        x: number;
        y: number;
    } = {
        service: 'WMS',
        version: '1.1.1',
        request: 'GetFeatureInfo',
        layers: 'lab8_2:gammelstad',
        bbox: bbox,
        width: mapSize.x,
        height: mapSize.y,
        query_layers: 'lab8_2:gammelstad', 
        info_format: 'application/json', 
        srs: 'EPSG:3857',
        x: Math.round(point.x),
        y: Math.round(point.y)
    };

    const queryString = Object.keys(baseParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(baseParams[key])}`)
        .join('&');

    return `${baseUrl}?${queryString}`;
}

function openPopup(latlng: L.LatLng, content: string) {
    L.popup()
        .setLatLng(latlng)
        .setContent(content)
        .openOn(map);
}
