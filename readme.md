Hospital Management System
A MERN-based Hospital Management System that enables hospitals to manage patients, doctors, branches, medical records, and more. Built with Node.js, Express, MongoDB, and JWT authentication for security.

📌 Features
✔ User Authentication – Secure login & registration for hospitals
✔ Branch Management – Add and manage multiple hospital branches
✔ Doctor Management – Register doctors, assign them to branches
✔ Patient Management – Add patients and assign doctors
✔ Medical Records – Store and update patient records
✔ Role-Based Access Control (RBAC) – Secure API access
✔ MongoDB Aggregation Pipelines – Optimized queries

🚀 Tech Stack
Backend: Node.js, Express.js, MongoDB (Mongoose ORM)
Authentication: JWT (JSON Web Tokens)
Database: MongoDB Atlas
Middleware: Express Middleware (CORS, Cookie Parser)

📂 Project Structure
/backend
 ├── src/
 │   ├── controllers/       # API Controllers
 │   ├── models/            # MongoDB Models
 │   ├── routes/            # API Routes
 │   ├── middlewares/       # Authentication & Error Handling
 │   ├── utils/             # Utility Functions (Error Handling, Responses)
 │   ├── config/            # Database Configuration
 │   ├── index.js           # Server Entry Point
 │   ├── .env               # Environment Variables
 │   ├── package.json       # Dependencies & Scripts
🛠 Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/NileshKumar2404/HospitalManagementSystem
cd Hospital-Management-System

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables
Create a .env file in the root directory:


PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

4️⃣ Start the Server
npm start  # Runs the server on port 3000


📌 API Endpoints
🔹 Authentication
Method	Endpoint	                Description
POST	/api/v1/hospitals/register	Register a hospital
POST	/api/v1/hospitals/login	    Hospital login

🔹 Doctors Management
Method	Endpoint	                Description
POST	/api/v1/doctors/register	Register a doctor
GET	    /api/v1/doctors/	        Get all doctors
GET	    /api/v1/doctors/:doctorId	Get doctor by ID
PUT	    /api/v1/doctors/update/:doctorId	Update doctor details
DELETE	/api/v1/doctors/:doctorId	Delete doctor

🔹 Patients Management
Method	Endpoint	                        Description
POST	/api/v1/patients/register	        Register a patient
GET	    /api/v1/patients/	                Get all patients
GET	    /api/v1/patients/:patientId	        Get patient by ID
PUT	    /api/v1/patients/update/:patientId	Update patient details
DELETE	/api/v1/patients/:patientId	        Delete patient
GET	    /api/v1/patients/doctor/:doctorId	Get patients treated by a doctor
GET	    /api/v1/patients/branch/:branchId	Get patients admitted in a branch

🔹 Medical Records Management
Method	Endpoint	                             Description
POST	/api/v1/medicalRecords/:patientId	     Create a medical record
GET	    /api/v1/medicalRecords/:patientId	     Get medical record by patient
PUT	    /api/v1/medicalRecords/update/:recordId	 Update medical record
DELETE	/api/v1/medicalRecords/:patientId	     Delete medical record
GET	    /api/v1/medicalRecords/	                 Get all medical records


🔒 Authentication & Security
JWT Authentication: Secure token-based authentication for hospitals.
Middleware Protection: verifyJWT ensures only authorized users access APIs.


📌 Future Improvements
✅ Add Appointment Scheduling
✅ Implement Email Notifications for Patients
✅ Build an app using Kotlin

👨‍💻 Contributing
Fork the repo
Create a new branch (git checkout -b feature-branch)
Commit changes (git commit -m "Added new feature")
Push to GitHub (git push origin feature-branch)
Submit a Pull Request 🚀


📜 License
This project is open-source and available under the MIT License.

🌟 Show Your Support
If you like this project, ⭐ Star the repo and share it with others! 😊