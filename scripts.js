const wrapper = document.querySelector(".weather-container"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector(".location-btn"),
  wIcon = document.querySelector(".weather-section img"),
  arrowBack = document.querySelector(".icon-left");

let api;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser doesn't support Geolocation.");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api).then((response) =>
    response
      .json()
      .then((result) => weatherDetails(result))
      .catch(() => {
        infoTxt.innerText = "Something went wrong.";
        infoTxt.classList.replace("pending", "error");
      })
  );
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `The place ${inputField.value} is not found in records.`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id === 800) {
      wIcon.src = "media/sunny.png";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "media/storm.png";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "media/snowy.png";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "media/haze.png";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "media/cloudy.png";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "media/rainy.png";
    }

    wrapper.querySelector(".temp .number").innerText = Math.floor(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .number-2").innerText = Math.floor(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
  }
  console.log(info);
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
  infoTxt.innerText = "";
});
