import express from "express";

import categoryRouter from "./routes/categoryRoutes";

const app = express();
app.use(express.json());

// 1) MIDDLEWARE

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }
// app.use(express.json());

// app.use(express.static(`${__dirname}/public`));
// app.use(express.static(`public`));
// app.use((req, res, next) => {
//   console.log('middleware');
//   next();
// });
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

///3) ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

app.use("/api/v1/categories", categoryRouter);
export default app;
