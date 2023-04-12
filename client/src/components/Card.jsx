import React from "react";

import { download } from "../assets";
import { downloadImage } from "../utils";

const Card = ({ _id, prompt, photo }) => (
	<div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
		<img
			className="w-full h-auto object-cover rounded-xl"
			src={photo}
			alt={prompt}
		/>
		<div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
			<p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

			<div className="flex ">
				<button
					type="button"
					onClick={() => downloadImage(_id, photo)}
					className="outline-none bg-transparent border-none justify-end items-end flex w-full"
				>
					<img
						src={download}
						alt="download"
						className="w-6 h-6 object-contain invert"
					/>
				</button>
			</div>
		</div>
	</div>
);

export default Card;
