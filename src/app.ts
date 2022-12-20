import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./routes/auth";
import movieRoutes from "./routes/movie";
import likeRoutes from "./routes/like";
import commentRoutes from "./routes/comment";
import watchlistRoutes from "./routes/watchlist";

import { errorHandler } from "./middleware/error-handler";
import { setHeaderField } from "./middleware/set-header";
import "dotenv/config";
import { connect } from "./db/connect";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

const app = express();

app.use(bodyParser.json());
app.use(setHeaderField);
app.use(cors());

app.use("/", authRoutes);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/movies", commentRoutes);
app.use("/movies", movieRoutes);
app.use("/movies", likeRoutes);
app.use("/watchlists", watchlistRoutes);

app.use(errorHandler);

connect(app);

export default app;
