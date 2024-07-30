const userTab = document.querySelector("[data-userWeather]");//
const searchTab = document.querySelector("[data-searchWeather]");//
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');// ++ default page
const searchForm = document.querySelector("[data-searchForm]");//  ++
const loadingScreen = document.querySelector('.loading-container');  //++
const userInfoContainer = document.querySelector(".user-info-container"); //++ weathrt info result display krne wala

//initaially vairables need
let oldTab = userTab;
const API_KEY = "6faff61036aba7ba3df2c73bd0b0a1ea";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
    
        if(!searchForm.classList.contains('active')) {
            //kya search form wala container is invisible, if yes then make it visible
            grantAccessContainer.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
            console.log('switchTab() k if wala dabba');
        }
        else{
            //main phale search wale tab pr tha,  ab your watheer tab visible krna hai
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            console.log('switchTab() k else wala dabba');
           
           //ab mai your weather tab me aaya hu, toh weather bhi display krna pdega , so let's check local storage first for coordinates , if we have saved them there
            getfromSessionStorage();
        }
    }    
}

searchTab.addEventListener('click', ()=> {
    switchTab(searchTab);
})

userTab.addEventListener('click', ()=> {
    switchTab(userTab);
})

//check if the coordinates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nai mile
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;

    //make grantcontainer invisible 
    grantAccessContainer.classList.remove('active');
    //add loading visible
    loadingScreen.classList.add('active');

    //API CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');

        console.log('from detchUserweatherinfo() 75');
        renderWeatherInfo(data);
    }
    catch(err) {
        //HW
        loadingScreen.classList.remove('active');
    }
}

function renderWeatherInfo(weatherInfo) {
    //FIRSTLY WE HAVE TO FETCH THE ELEMENTS
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const desc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloudiness]');

    //fetch values from weatherInfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

    console.log('form render');
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
        console.log('hello from getLocation() 108');
    }
    else{
        //HW --- show an alert for no geolocation suppoert available
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    console.log("from showPosition() 122");
    // console.log('lat = ', lat);
    // console.log('long =', lon);
    fetchUserWeatherInfo(userCoordinates);
}
 
const grantAccessButton = document.querySelector('[data-grantAccess]');
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();         //removes the default method
    let cityName = searchInput.value;

    if(cityName === "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err) {

    }
}

