import { useState, useEffect } from "react";

import axios from "axios";

import {
	IoMdSunny,
	IoMdRainy,
	IoMdCloudy,
	IoMdSnow,
	IoMdThunderstorm,
	IoMdSearch,
} from "react-icons/io";

import {
	BsCloudHaze2Fill,
	BsCloudDrizzleFill,
	BsEye,
	BsWater,
	BsThermometer,
	BsWind,
} from "react-icons/bs";

import { TbTemperatureCelsius, TbTemperatureFahrenheit } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "7f2b06c8b3cdb3e4f1eff4dee17df526";

const App = () => {
	const [data, setData] = useState(null);
	const [location, setLocation] = useState("Alajuela");
	const [inputValue, setInputValue] = useState("");
	const [animate, setAnimate] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [temps, setTemps] = useState();
	const [isCelsius, setIsCelsius] = useState(true);

	const handleInput = (e) => {
		setInputValue(e.target.value);
	};

	const changeUnitTemp = () => setIsCelsius(!isCelsius)

	

	const handleSubmit = (e) => {
		console.log(inputValue);

		if (inputValue !== "") {
			setLocation(inputValue);
		}

		const input = document.querySelector("input");

		if (inputValue === "") {
			setAnimate(true);

			setTimeout(() => {
				setAnimate(false);
			}, 500);
		}

		input.value = "";

		e.preventDefault();
	};

	useEffect(() => {
		setLoading(true);

		const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

		axios
			.get(URL)
			.then((res) => {
				setTimeout(() => {
					{setData(res.data)
					const celsius = (res.data.main.temp - 273.15).toFixed(2);
					const fahrenheit = (celsius * (9/5) + 32).toFixed(2);
					const newTemps ={
						celsius,
						fahrenheit
					}
					setTemps(newTemps)
					};
					setLoading(false);
				}, 1000);
			})
			.catch((err) => {
				setLoading(false);
				setErrorMsg(err);
			});
	}, [location]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setErrorMsg("");
		}, 2000);

		return () => clearTimeout(timer);
	}, [errorMsg]);

	if (!data) {
		// eslint-disable-next-line
		return (
			<div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center">
				<div>
					<ImSpinner8 className="text-5xl animate-spin text-white" />
				</div>
			</div>
		);
	}

	let icon;

	switch (data.weather[0].main) {
		case "Clouds":
			icon = <IoMdCloudy />;
			break;

		case "Haze":
			icon = <BsCloudHaze2Fill />;
			break;

		case "Rain":
			icon = <IoMdRainy className="text-[#31cafb]" />;
			break;

		case "Clear":
			icon = <IoMdSunny className="text-[#ffde33]" />;
			break;

		case "Drizzle":
			icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
			break;

		case "Snow":
			icon = <IoMdSnow className="text-[#31cafb]" />;
			break;

		case "Thunderstorm":
			icon = <IoMdThunderstorm />;
			break;
	}

	const date = new Date();

	return (
		<div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
			{errorMsg && (
				<div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md">
					{`${errorMsg.response.data.message}`}
				</div>
			)}
			<form
				className={`${animate ? "animate-shake" : "animate-none"} 
        h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
				<div className="h-full relative flex items-center justify-between p-2">
					<input
						onChange={(e) => handleInput(e)}
						type="text"
						placeholder="Search by city or country"
						className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full"
					/>
					<button
						onClick={(e) => handleSubmit(e)}
						className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition">
						<IoMdSearch className="text-2xl text-white" />
					</button>
				</div>
			</form>

			<div className=" w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
				{loading ? (
					<div className="w-full h-full flex justify-center items-center">
						<ImSpinner8 className="text-white text-5xl animate-spin" />
					</div>
				) : (
					<div>
						<div className=" flex items-center gap-x-5">
							<div className="text-[87px]">{icon}</div>

							<div>
								<div className="text-2xl font-semibold">
									{data.name}, {data.sys.country}
								</div>

								<div>
									{date.getUTCDate()}/{date.getUTCMonth() + 1}/
									{date.getUTCFullYear()}
								</div>
							</div>
						</div>

						<div className="my-20">
							<div className="flex justify-center items-center">
								<div className="text-[100px] leading-none font-light">
									{isCelsius ? temps?.celsius : temps?.fahrenheit}
									
								</div>
								<div className="text-[50px] leading-none font-light">
									{isCelsius ? <TbTemperatureCelsius/> : <TbTemperatureFahrenheit/>}
									</div>
									
							</div>
							
							<div className="capitalize text-center">
								{data.weather[0].description}
							</div>

							<div className="flex justify-center items-center py-3">
							<button
								className="flex justify-center items-center bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-8 rounded-full transition"
								onClick={changeUnitTemp}> <TbTemperatureFahrenheit/> / <TbTemperatureCelsius/>
							</button>
							</div>
						</div>

						<div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
							<div className="flex justify-between">
								<div className="flex items-center gap-x-2">
									<div className="text'[20px]">
										<BsEye />
									</div>

									<div>
										visibility{" "}
										<span className="ml-2">{data.visibility / 1000} km</span>
									</div>
								</div>

								<div className="flex items-center gap-x-2">
									<div className="text'[20px]">
										<BsThermometer />
									</div>

									<div className="flex">
										Feels like
										<span className="ml-2">
											{parseInt(data.main.feels_like)}
										</span>
										<TbTemperatureCelsius />
									</div>
								</div>
							</div>

							<div className="flex justify-between">
								<div className="flex items-center gap-x-2">
									<div className="text'[20px]">
										<BsWater />
									</div>

									<div>
										Humidity
										<span className="ml-2">
											{parseInt(data.main.humidity)} %
										</span>
									</div>
								</div>

								<div className="flex items-center gap-x-2">
									<div className="text'[20px]">
										<BsWind />
									</div>

									<div>
										Wind <span className="ml-2">{data.wind.speed}m/s</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default App;
