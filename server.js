const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

// Kết nối MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/products", productRoutes);

const DEFAULT_PORT = 5000;
const portEnv = process.env.PORT ? Number(process.env.PORT) : DEFAULT_PORT;

function startServer(port) {
	const server = app.listen(port, () =>
		console.log(`Server running on port ${port}`)
	);

	server.on("error", (err) => {
		if (err && err.code === "EADDRINUSE") {
			console.error(`Port ${port} is already in use.`);
			if (port === DEFAULT_PORT) {
				const fallback = port + 1;
				console.log(`Trying fallback port ${fallback}...`);
				// try one fallback port
				startServer(fallback);
			} else {
				console.error("No more fallback ports to try. Exiting.");
				process.exit(1);
			}
		} else {
			console.error("Server error:", err);
			process.exit(1);
		}
	});
}

startServer(portEnv);
