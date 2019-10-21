window.iMap = {
    contacts: function () {
        var m = [55.784207, 37.559550];
        var rumap = this.create(document.getElementById('map'), m, 15);
        this.addMarkers(rumap, [m]);
    },

    addMarkers: function (map, markers) {
        for (var i in markers) {
            var place = new ymaps.Placemark(markers[i], {
            }, {
                iconLayout: 'default#image',
                iconImageHref: './assets/img/map-marker.svg',
                iconImageSize: [43, 45],
                iconImageOffset: [-21, -24],
            });

            map.geoObjects.add(place);
        }
    },

    create: function (elem, center, zoom) {
        return new ymaps.Map(elem, {
            center: center,
            zoom: zoom || 12,
            controls: []
        });
    }
}