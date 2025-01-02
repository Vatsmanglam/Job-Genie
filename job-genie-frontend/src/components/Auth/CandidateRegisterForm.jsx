import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Creatable from "react-select/creatable";

import { login as storeLogin } from "../../store/authSlice";
import api from "../../api/axiosConfig";
import { skillOptions } from "../../data/constants";

const CandidateRegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState([]);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [skillsError, setSkillsError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let valid = true;

    if (name.length < 3) {
      setNameError("Name must be at least 3 characters long.");
      valid = false;
    } else if (/\d/.test(name)) {
      setNameError("Name should not contain numbers.");
      valid = false;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format.");
      valid = false;
    } else {
      setEmailError("");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("Password min length 6, must contain one 1 uppercase letter and 1 number.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (skills.length === 0) {
      setSkillsError("Please select at least one skill.");
      valid = false;
    } else {
      setSkillsError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const skillsArray = skills.map((item) => item.value);
    const formData = { name, email, password, skills: skillsArray };

    setIsLoading(true);

    try {
      const response = await api.post("/api/v1/candidates/signup", formData);

      if (response.status === 201) {
        dispatch(storeLogin({ isRecruiter: false, userData: response.data }));

        navigate("/");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-14 mb-24 bg-slate-700 w-full max-w-md 2xl:max-w-xl rounded-lg flex flex-col gap-4 2xl:gap-10 mx-auto"
    >
      <h1 className="text-3xl 2xl:text-5xl font-bold text-white text-center mb-8 2xl:mb-12">
        Candidate Signup
      </h1>

      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full py-2 px-4 text-lg rounded-lg text-black/80 font-semibold"
          required={true}
        />
        {nameError && <p className="text-red-500">{nameError}</p>}
      </div>

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-2 px-4 text-lg rounded-lg text-black/80 font-semibold"
          required={true}
        />
        {emailError && <p className="text-red-500">{emailError}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-2 px-4 text-lg rounded-lg text-black/80 font-semibold"
          required={true}
        />
        {passwordError && <p className="text-red-500">{passwordError}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full py-2 px-4 text-lg rounded-lg text-black/80 font-semibold ${
            password === confirmPassword
              ? "border-green-500 outline-green-500"
              : confirmPassword && "border-red-500 outline-red-500"
          }`}
          required={true}
        />
        {confirmPasswordError && (
          <p className="text-red-500">{confirmPasswordError}</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg text-white mb-1 font-medium">Skills</h3>
        <Creatable
          options={skillOptions}
          isMulti
          value={skills}
          onChange={(selectedOptions) => setSkills(selectedOptions)}
        />
        {skillsError && <p className="text-red-500">{skillsError}</p>}
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          !name ||
          !email ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword
        }
        className={`py-2 px-4 my-10 bg-green-500 hover:opacity-70 rounded-lg text-white text-lg font-semibold transition-opacity ${
          (isLoading ||
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword) &&
          "opacity-30 hover:opacity-40"
        }`}
      >
        Register
      </button>

      {/* ERROR NOTIFICATION */}
      <p className="text-red-500 text-center text-lg font-black">{error}</p>

      <p className="text-secondary text-center">
        <Link
          to="/login/candidate"
          className="text-white/80 hover:text-purple-500 text-lg font-semibold"
        >
          Already Registered? Login here
        </Link>
      </p>
    </form>
  );
};

export default CandidateRegisterForm;
