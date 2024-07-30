const API_KEY = "6faff61036aba7ba3df2c73bd0b0a1ea";
async function fetchWeatherDetails() {
    // let city = 'goa';
    // let lat = 15.333;
    // let lon = 74.033;

    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}`);

    try{
        let city = "Darbhanga";
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        console.log('Weather data:-> ' , data);
        renderWeatherInfo(data);
        
    }
    catch(e){
        console.log("error is" , e);
    }
}

function renderWeatherInfo(data) {
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    document.body.appendChild(newPara);
}

async function getCustomWeatherDetails() {

    try{
        let latitude = 22.6230272;
        let longitude = 88.4277248;

        let result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}lon=${longitude}&appid=${API_KEY}`);
        let data = await result.json();
    console.log("weather is: " , data);
    }
    catch(err) {
        console.log("error found"+err);
    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("no geoLocation Support");
    }
}

function showPosition(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
}