import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Hospital } from "../models/Hospital.models.js";
import jwt from "jsonwebtoken";
import { Branch } from "../models/branch.models.js";

const generateAccessandRefreshToken = async (hospitalId) => {
  try {
    const hospital = await Hospital.findById(hospitalId);
    const accessToken = await hospital.generateAccessToken();
    const refreshToken = await hospital.generateRefreshToken();

    // Save refresh token in DB but don't return it twice
    hospital.refreshToken = refreshToken;
    await hospital.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }; // ✅ Fix: Return only once
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const registerHospital = asynchandler(async (req, res) => {
  const { hospitalName, email, password, branchId, specializedIn } = req.body;

  if (hospitalName === "") {
    throw new ApiError(400, "Name is required");
  }

  if (password === "") {
    throw new ApiError(400, "Password is required");
  }

  if (specializedIn === "") {
    throw new ApiError(400, "Specialization is required");
  }

  if (branchId === "") {
    throw new ApiError(400, "Branch Id is required");
  }

  if (email === "") {
    throw new ApiError(400, "Email Id is required");
  }

  const existedHospital = await Hospital.findOne({ email });

  if (existedHospital) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Hospital already exists", {}));
  }

  const newHospital = await Hospital.create({
    hospitalName: hospitalName,
    password: password,
    specializedIn: specializedIn,
    branch: [branchId],
    email: email,
  });

  const createdHospital = await Hospital.findById(newHospital._id).select(
    "-password"
  );

  if (!createdHospital) {
    throw new ApiError(400, "User not created");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    createdHospital._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Hospital registered successfully", {
        Hospital: createdHospital,
        accessToken,
        refreshToken,
      })
    );
});

const loginHospital = asynchandler(async (req, res) => {
  const { hospitalName, password, email, branchId } = req.body;

  if (!hospitalName) {
    throw new ApiError(400, "Name is required");
  }
  if (!branchId) {
    throw new ApiError(400, "Branch Id is required");
  }
  if (!email) {
    throw new ApiError(400, "Email Id is required");
  }

  const findHospital = await Hospital.findOne({ email });

  if (!findHospital) {
    throw new ApiError(400, "Hospital not found, first register the hospital");
  }

  const isPasswordValid = await findHospital.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect password");
  }

  if (!findHospital.branch.includes(branchId)) {
    throw new ApiError(400, "BranchId does not match with the hospital");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    findHospital._id
  );

  const loggedInHospital = await Hospital.findById(findHospital._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Logged in successfully", {
        Hospital: loggedInHospital,
        accessToken,
        refreshToken,
      })
    );
});

const logoutHospital = asynchandler(async (req, res) => {
  await Hospital.findByIdAndUpdate(
    req.hospital._id,
    {
      $unset: {
        refreshToken: "",
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "Logged out successfully", {}));
});

const refreshAccessToken = asynchandler(async (req, res) => {
  const incomingrefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingrefreshToken) {
    throw new ApiError(400, "User logged out");
  }

  try {
    const decodedToken = jwt.verify(
      incomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const hospital = await Hospital.findById(decodedToken?._id);

    if (!hospital) {
      throw new ApiError(400, "Invalid refresh token");
    }

    if (incomingrefreshToken !== hospital?.refreshToken) {
      throw new ApiError(400, "Refresh token is expired or already used");
    }

    const options = {
      secure: true,
      httpOnly: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessandRefreshToken(hospital._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(200, "Access token refreshed", {
        accessToken,
        refreshToken: newRefreshToken,
      });
  } catch (error) {
    throw new ApiError(400, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asynchandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword && !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const hospital = await Hospital.findById(req.hospital._id);

  if (!hospital) {
    throw new ApiError(400, "Hospital is not found");
  }

  const isPasswordCorrect = await hospital.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  hospital.password = newPassword;
  await hospital.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});

const listOfBranch = asynchandler(async (req, res) => {
  try {
    const branch = await Branch.find().select('address');
    if (!branch) {
      throw new ApiError(400, "No branch found");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "All branches are fetched successfully", branch));
  } catch (error) {
    console.error("List of branch" + error);
  }
});



export {
  registerHospital,
  loginHospital,
  logoutHospital,
  refreshAccessToken,
  changeCurrentPassword,
  listOfBranch
};
