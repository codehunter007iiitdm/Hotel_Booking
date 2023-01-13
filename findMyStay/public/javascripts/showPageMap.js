
  mapboxgl.accessToken =mapToken;
  const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: Stay.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
  });

  map.addControl(new mapboxgl.NavigationControl())

  new mapboxgl.Marker()
      .setLngLat(Stay.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${Stay.title}</h3><p>${Stay.location}</p>`
        )
      )
      .addTo(map)