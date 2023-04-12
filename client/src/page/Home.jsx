import React, { useEffect, useRef, useState } from "react";

import { Card, FormField, Loader } from "../components";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const RenderCards = ({ data, title }) => {
	if (data?.length > 0) {
		return data.map((post) => <Card key={post._id} {...post} />);
	}

	return (
		<h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
	);
};

const getPrediction = (prompt, randomValue = 3) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let result = [];
			var present = null;
			present = randomPromptsAndResults.find((obj) =>
				obj.hasOwnProperty(prompt)
			);
			console.log(`present value ${present} `);
			if (present !== undefined) {
				console.log(`${present[prompt]}`);
			}
			if (randomPromptsAndResults[randomValue][prompt]) {
				result = randomPromptsAndResults[randomValue][prompt];
			} else if (present != null) {
				result = present[prompt];
			} else if (prompt.trim() != "" && prompt != undefined) {
				result = randomPromptsAndResults[3]["default prompt"];
			}
			console.log(result);
			resolve({
				status: "succeeded",
				result: result,
				metrics: {
					predict_time: 11.990901,
				},
			});
		}, 10000);
	});
};

const Home = () => {
	const [prompt, setPrompt] = useState("");
	const [images, setImages] = useState([]);
	const [progress, setProgress] = useState(0);
	const [initialLoad, setInitialLoad] = useState(true);
	const currentProgress = useRef();
	const fetchPosts = async () => {
		setLoading(true);
		console.log("Inside fetching posts");

		try {
			const response = await fetch("http://localhost:8080/api/v1/post", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const result = await response.json();
				console.log("Result is " + result.data);
				setAllPosts(result.data.reverse());
			}
		} catch (err) {
			alert(err);
		} finally {
			setLoading(false);
			console.log("Inside fetching posts last", allPosts);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);
	const [loading, setLoading] = useState(false);
	const [allPosts, setAllPosts] = useState(null);

	// const [searchText, setSearchText] = useState("");
	// const [searchTimeout, setSearchTimeout] = useState(null);
	// const [searchedResults, setSearchedResults] = useState(null);

	useEffect(() => {
		return () => clearInterval(currentProgress.current);
	}, []);
	useEffect(() => {
		if (progress >= 100) {
			clearInterval(currentProgress.current);
			setProgress(0);
		}
	}, [progress]);
	const timer = () => {
		if (progress != 0) {
			clearInterval(currentProgress.current);
			setProgress(0);
		}
		currentProgress.current = setInterval(() => {
			setProgress((prev) => prev + 1);
		}, 100);
	};

	const handleSubmit = async (e) => {
		setImages([]);
		if (prompt.trim() === "" || prompt === null) {
			return toast.error("Prompt Cannot be empty");
		}
		setInitialLoad(false);
		timer();
		console.log(prompt);
		// setInProgress(true);

		const response = await getPrediction(prompt);

		const { result } = response;
		setImages(result);
	};

	const handleRandom = async (e) => {
		setInitialLoad(false);
		setImages([]);
		timer();
		let response;
		var prompt;
		const randomIndex = Math.floor(Math.random() * 3);
		switch (randomIndex) {
			case 0:
				prompt = Object.keys(randomPromptsAndResults[0])[0];
				break;
			case 1:
				prompt = Object.keys(randomPromptsAndResults[1])[0];
				break;
			case 2:
				prompt = Object.keys(randomPromptsAndResults[2])[0];
				break;
			default:
				prompt = Object.keys(randomPromptsAndResults[3])[0];
		}
		setPrompt(prompt);
		response = await getPrediction(prompt, randomIndex);
		const { result } = response;
		setImages(result);
	};

	// const handleSearchChange = (e) => {
	// 	clearTimeout(searchTimeout);
	// 	setSearchText(e.target.value);

	// 	setSearchTimeout(
	// 		setTimeout(() => {
	// 			const searchResult = allPosts.filter(
	// 				(item) =>
	// 					item.name.toLowerCase().includes(searchText.toLowerCase()) ||
	// 					item.prompt.toLowerCase().includes(searchText.toLowerCase())
	// 			);
	// 			setSearchedResults(searchResult);
	// 		}, 500)
	// 	);
	// };
	return (
		<div className="flex min-h-screen w-full flex-col object-contain bg-black">
			<div className="relative h-96 w-full">
				<div className="absolute h-full w-full bg-[url('https://static.fotor.com/app/features/img/aiimage/background_image3.jpg')] bg-cover object-cover"></div>

				<div className="extra absolute flex h-full  w-full flex-col items-center justify-center  bg-gradient-to-tr from-yellow-300 to-green-400 bg-clip-text text-3xl md:text-5xl  lg:text-7xl font-bold text-transparent">
					Text to Image with <br />
					<hr />
					AI Image Generator
				</div>
				<div className="absolute bottom-0 flex flex-col md:flex-row  w-full gap-2 bg-transparent px-8 md:py-8 md:px-28">
					<input
						className="flex-1 rounded-lg border md:px-3 w-full p-2 md:p-0 "
						type="text"
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Describe what you want to see, Confused what to type ? select Suprise Me"
					/>
					<div className="flex gap-2 justify-center items-center disabled:bg-gray-400 mb-6 mt-4 md:my-0">
						<button
							className="rounded-lg bg-green-400 p-2"
							// onClick={handleSubmit}
							disabled={progress > 0}
						>
							Generate
						</button>
						<button
							disabled={progress > 0}
							// onClick={handleRandom}
							className="rounded-lg border border-green-400 p-2 text-green-400"
						>
							Suprise Me
						</button>
					</div>
				</div>
			</div>
			{images.length != 0 ? (
				<div className="grid grid-cols-2 gap-4  md:px-28 px-8 py-8 bg-gradient-to-b from-[#2e1216] bg-black w-full">
					{images.map((image, index) => (
						<img
							key={index}
							src={image}
							className={`h-48 ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}
							alt={`Image ${index}`}
						/>
					))}
				</div>
			) : (
				!initialLoad && (
					<div className=" md:h-96 md:flex flex-col justify-start items-start md:px-28 px-8 py-8  bg-gradient-to-b from-[#2e1216] bg-black w-full ">
						<div className=" md:flex flex-col md:flex-row rounded-lg md:h-72 md:w-full ">
							<div className=" md:hidden text-white">
								Your image is being created by AI
							</div>
							{progress && (
								// <Progress value={progress} color="green" variant="gradient" />
								<progress
									className=" md:hidden progress w-full progress-accent h-3"
									value={progress}
									max="100"
								></progress>
							)}
							<img
								className=" md:h-72 md:w-72 "
								src="https://th.bing.com/th/id/OIP.TwiIfaePJW6nAT1P4dp_cgHaHa?pid=ImgDet&rs=1"
							></img>
							<div className="bg-gray-400 bg-opacity-40 flex-1 flex flex-col p-8">
								<div className="text-white text-xl md:text-2xl font-extrabold mb-4">
									Pro Tip 💡
								</div>
								<div className="text-white text-xl md:text-xl mb-8 font-semibold">
									Get crazy with your prompt
								</div>
								<div className="text-white text-xl md:text-2xl">
									Try: "An astronaut resting on mars in a beach chair, vibrant
									lighting, elegant, highly detailed, smooth, sharp focus,
									illustration, beautiful, geometric"
								</div>
							</div>
						</div>
						{progress && (
							// <Progress value={progress} color="green" variant="gradient" />
							<progress
								className="hidden md:block progress w-full progress-accent h-3"
								value={progress}
								max="100"
							></progress>
						)}
						<div className="hidden md:block text-white">
							Your image is being created by AI
						</div>
					</div>
				)
			)}
			<div className=" py-4 md:py-8 text-center text-2xl text-white bg-black">
				Featured Gallery
			</div>
			<div className="flex md:flex-row flex-col justify-evenly gap-4 bg-black md:px-28 py-4">
				{
					allPosts && allPosts.map((post) => <Card key={post._id} {...post} />)
					// allPosts.map((e) => (
					// 	<div className="relative h-full group md:w-1/3 px-8 md:px-0">
					// 		<img
					// 			src={e.photo}
					// 			alt="Your Image"
					// 			className="h-72 w-full rounded-lg"
					// 		/>
					// 		<div className="invisible group-hover:visible absolute inset-x-0 bottom-0 px-9 md:px-0 bg-black bg-opacity-50 p-4">
					// 			<h2 className="font-bold text-white">{e.prompt}</h2>
					// 		</div>
					// 	</div>
					// ))
				}
			</div>
			<ToastContainer />
		</div>
	);

	// return (
	// 	<section className="max-w-7xl mx-auto">
	// 		<div>
	// 			<h1 className="font-extrabold text-[#222328] text-[32px]">
	// 				The Community Showcase
	// 			</h1>
	// 			<p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
	// 				Browse through a collection of imaginative and visually stunning
	// 				images generated by DALL-E AI
	// 			</p>
	// 		</div>

	// 		<div className="mt-16">
	// 			<FormField
	// 				labelName="Search posts"
	// 				type="text"
	// 				name="text"
	// 				placeholder="Search something..."
	// 				value={searchText}
	// 				handleChange={handleSearchChange}
	// 			/>
	// 		</div>

	// 		<div className="mt-10">
	// 			{loading ? (
	// 				<div className="flex justify-center items-center">
	// 					<Loader />
	// 				</div>
	// 			) : (
	// 				<>
	// 					{searchText && (
	// 						<h2 className="font-medium text-[#666e75] text-xl mb-3">
	// 							Showing Resuls for{" "}
	// 							<span className="text-[#222328]">{searchText}</span>:
	// 						</h2>
	// 					)}
	// 					<div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
	// 						{searchText ? (
	// 							<RenderCards
	// 								data={searchedResults}
	// 								title="No Search Results Found"
	// 							/>
	// 						) : (
	// 							<RenderCards data={allPosts} title="No Posts Yet" />
	// 						)}
	// 					</div>
	// 				</>
	// 			)}
	// 		</div>
	// 	</section>
	// );
};

export default Home;
