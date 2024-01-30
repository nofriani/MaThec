import { useRef, useState } from "react";
import logoAuth from "../../images/logo.jpg";
import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

export default function Auth() {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    password1: "",
  });
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [messageErr, setMessageErr] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [success, setSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const register = async (name, email, password) => {
    if (registerForm.password !== registerForm.password1) {
      setPasswordMatch(false);
    } else {
      const response = await fetch(
        process.env.REACT_APP_API_HOST + "/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const json = await response.json();
      if (json.succcess) {
        setSuccess(true);
        handlePanel();
      } else {
        setError(true);
      }
    }
  };

  const login = async (email, password) => {
    const response = await fetch(process.env.REACT_APP_API_HOST + "/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json();
    console.log(json);
    console.log(response.status);
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));
      navigate("/");
    } else if (response.status === 403) {
      // setError(true);
      setMessageErr("Akun Anda Ditangguhkan");
    } else {
      // setError(true);
      setMessageErr("Email or password failed!");
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    await register(
      registerForm.name,
      registerForm.email,
      registerForm.password
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);
  };

  const handlePanel = () => {
    const background = document.querySelector(".container-auth");
    background.classList.toggle("left-overlay-active");
    setRegisterForm({
      name: "",
      email: "",
      password: "",
      password1: "",
    });
    setloginForm({
      email: "",
      password: "",
    });
    setSuccess(false);
    setError(false);
    setPasswordMatch(true);
  };

  const handleInputRegister = (event) => {
    setRegisterForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleInputLogin = (event) => {
    setloginForm((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };
  const sidebar = useRef(null);

  const openSidebar = () => {
    sidebar.current.classList.toggle("active");
  };

  return (
    <div className="content-auth">
      <div className="header">
        <div className="burger" onClick={openSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="background-blur" ref={sidebar}>
        <div className="sidebar">
          <ul>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/allquestion"}>Question</Link>
            </li>
            <li>
              <Link to={"/tag"}>Tags</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-auth">
        {/* auth */}
        <div className="container-form">
          <div className="form">
            <div className="signIn">
              <h2 className="mt-1">Login</h2>
              {messageErr === "Your account is blocked!" ? (
                <div className="alert alert-danger">{messageErr}</div>
              ) : messageErr === "Email or password failed!" ? (
                <div className="alert alert-danger">
                  Email or password failed!
                </div>
              ) : (
                ""
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    name="email"
                    type="email"
                    onChange={handleInputLogin}
                    placeholder="Input your email"
                    className="form-control"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    onChange={handleInputLogin}
                    placeholder="Input your password"
                    className="form-control"
                  />
                </div>
                <button className="btn btn-success mt-3 mb-2 w-100">
                  Login
                </button>
                <span>
                  Dont have an account?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={handlePanel}
                  >
                    Register
                  </span>
                </span>
                <br />
                <span>
                  Forgot Password?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot
                  </span>
                </span>
              </form>
            </div>
            <div className="signUp">
              {error === true ? (
                <div className="alert alert-danger">Email is forbiden</div>
              ) : (
                ""
              )}

              {passwordMatch === false ? (
                <div className="alert alert-danger">Password faied!</div>
              ) : (
                ""
              )}
              {error === true ? (
                <div className="alert alert-danger">This Email Is Forbiden</div>
              ) : (
                ""
              )}
              <h2>Register</h2>
              <form onSubmit={handleSubmitRegister}>
                <div className="form-group mb-3">
                  <label>Username</label>
                  <input
                    className="form-control"
                    name="name"
                    onChange={handleInputRegister}
                    type="name"
                    placeholder="Input your username"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    name="email"
                    onChange={handleInputRegister}
                    type="email"
                    placeholder="Input your email"
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Password</label>
                  <input
                    className="form-control"
                    name="password"
                    onChange={handleInputRegister}
                    type="password"
                    placeholder="Input your password"
                    min={8}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Confirm Password</label>
                  <input
                    className="form-control"
                    name="password1"
                    onChange={handleInputRegister}
                    type="password"
                    placeholder="Confirmation your password"
                    min={8}
                  />
                </div>
                <button className="btn btn-success mt-3 mb-2 d-block w-100">
                  Register
                </button>
                <span className="">
                  {" "}
                  Already have an account?{" "}
                  <span
                    style={{
                      color: "rgb(13, 110, 253)",
                      cursor: "pointer",
                    }}
                    onClick={handlePanel}
                  >
                    Login
                  </span>
                </span>
              </form>
            </div>
          </div>
        </div>
        {/* overlay */}
        <div className="overlay">
          <div className="overlay-content">
            <div className="overlay-left">
              <center>
                <img src={logoAuth} alt="" />
              </center>
              <p className="text-center">
                Increase the quality and quantity of discussions with FMIKOM
                UNUGHA CILACAP: Together we learn, develop, share in the fields
                of Mathematics and Technology
              </p>
            </div>
            <div className="overlay-right">
              <center>
                <img src={logoAuth} alt="" />
              </center>
              <p className="text-center">
                Increase the quality and quantity of discussions with FMIKOM
                UNUGHA CILACAP: Together we learn, develop, share in the fields
                of Mathematics and Technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
