

const socket=io();

//check if browser supports geoloaction
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const{latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy:true,
        timeout:100,
        maximumAge:0,//no caching
    });
    
}

//leaflet ko use krna
const map=L.map("map").setView([0,0],8);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map)



const markers={};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude],8);
    if(markers[id]){
        markers[id].setLatLng({latitude,longitude});
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})