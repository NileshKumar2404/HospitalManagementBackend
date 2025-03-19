import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use((req, res, next) => {
    console.log("Received ${req.method} request with body:", req.body);
    console.log("Received ${req.method} request with params:", req.params);
    next();
  });

//route declaration
import hospitalRouter from './routes/hospital.routes.js';
import branchRouter from './routes/branch.routes.js'
import doctorRouter from './routes/doctors.routes.js'
import patientRouter from './routes/patients.routes.js'
import medical_recordsRouter from './routes/medical_records.routes.js'

app.use("/api/v1/hospital", hospitalRouter)
app.use("/api/v1/branch", branchRouter)
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/medical_records", medical_recordsRouter)

export {app}