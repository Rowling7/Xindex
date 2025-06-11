// 加载城市数据
let cityData = [];
fetch('./city.json')
	.then(response => {
		if (!response.ok) {
			throw new Error('网络响应不正常');
		}
		return response.json();
	})
	.then(data => {
		if (!data.city) {
			throw new Error('城市数据格式错误');
		}
		cityData = data.city.flatMap(group => group.list);

		const datalist = document.getElementById("citySuggestions");
		if (!datalist) {
			console.warn("未找到 datalist 元素，请检查 HTML");
			return;
		}

		cityData.forEach(city => {
			const option = document.createElement("option");
			option.value = city.name;
			datalist.appendChild(option);
		});
	})
	.catch(error => {
		console.error('加载城市数据失败:', error);
		alert("城市数据加载失败，请检查网络或文件路径！");
	});
// 获取天气信息
function getWeather() {
	let city;
	const inputValue = document.getElementById("cityInput").value.trim();

	if (inputValue === "") {
		city = document.getElementById("citySelect").value;
	} else {
		const isChinese = /[\u4e00-\u9fa5]/.test(inputValue);
		if (isChinese) {
			const matchedCity = cityData.find(item => item.name === inputValue);
			if (matchedCity) {
				city = matchedCity.pinyin;
			} else {
				//alert("未找到该城市，请输入正确的城市名！");
				return;
			}
		} else {
			city = inputValue;
		}
	}

	// 发送天气请求（沿用原有逻辑）
	const weatherGet = new XMLHttpRequest();
	weatherGet.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=269d058c99d1f3cdcd9232f62910df1d`, true);
	weatherGet.onreadystatechange = function () {
		if (weatherGet.readyState === 4 && weatherGet.status === 200) {
			const weatherData = JSON.parse(weatherGet.responseText);

			// 翻译天气描述
			const weatherDescriptions = {
				'clear sky': '晴空',
				'few clouds': '少云',
				'scattered clouds': '散云',
				'broken clouds': '多云',
				'overcast clouds': '阴天',
				'shower rain': '阵雨',
				'rain': '雨',
				'light rain': '小雨',
				'moderate rain': '中雨',
				'heavy rain': '大雨',
				'thunderstorm': '雷暴',
				'snow': '雪',
				'light snow': '小雪',
				'heavy snow': '大雪',
				'mist': '薄雾',
				'fog': '雾',
				'haze': '霾',
				'dust': '尘',
				'sand': '沙尘',
				'smoke': '烟雾',
				'tornado': '龙卷风'
			};

			const englishDescription = weatherData.weather[0].description.toLowerCase();
			const chineseDescription = weatherDescriptions[englishDescription] || englishDescription;

			document.getElementById("weatherResult").innerHTML = chineseDescription;

			//当前湿度
			document.getElementById("weatherHumi").innerHTML = /* "当前湿度：" + */ weatherData.main.humidity;

			//当前温度
			var kdeg = (weatherData.main.temp - 273.15);
			var cdeg = kdeg.toFixed(1);
			document.getElementById("weatherTemp").innerHTML = /*"当前温度：" + */ cdeg;

			// 最高温
			var kdegmax = (weatherData.main.temp_max - 273.15);
			var cdegmax = kdegmax.toFixed(0); // 使用正确的变量
			document.getElementById("weatherTempMax").innerHTML = cdegmax + "°";

			// 最低温
			var kdegmin = (weatherData.main.temp_min - 273.15);
			var cdegmin = kdegmin.toFixed(0); // 使用正确的变量
			document.getElementById("weatherTempMin").innerHTML = cdegmin + "°";

			//城市
			document.getElementById("site").innerHTML = /* "城市 / 地区：" + */ weatherData.name + " / " + weatherData.sys.country;

			//icon
			document.getElementById("weatherimg").src = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/" + weatherData.weather[0].icon + ".png";

			//大气压
			document.getElementById("weatherPress").innerHTML = /* "大气压强：" + */ weatherData.main.pressure;

			//feelsLike、windSpeed、windDeg、clouds
			var feelsLike = (weatherData.main.feels_like - 273.15).toFixed(0);
			var windSpeed = weatherData.wind.speed;
			var clouds = weatherData.clouds.all;
			// feelsLike、windSpeed、windDeg、clouds
			document.getElementById("feelsLike").innerHTML = feelsLike + "°";
			document.getElementById("windSpeed").innerHTML = windSpeed + " m/s";
			document.getElementById("clouds").innerHTML = clouds + "%";
			// windDeg
			const windDeg = weatherData.wind.deg;
			const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
			const index = Math.round((windDeg % 360) / 45) % 8;
			const windDirection = directions[index];
			document.getElementById("windDeg").innerHTML = windDirection;
		}
	};

	weatherGet.send();
}
// 页面加载时自动查询威海天气
window.onload = function () {
	// 设置默认选中威海
	document.getElementById("citySelect").value = "Weihai";
	// 执行查询
	getWeather();
};

// 保持原有的 window.onfocus 逻辑
window.onfocus = function () {
	getWeather();
};