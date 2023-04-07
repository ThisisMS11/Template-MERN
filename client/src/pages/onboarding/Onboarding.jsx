import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './onboarding.css'
import Swal from 'sweetalert2'
import axios from 'axios'

const Onboarding = () => {

  const [cntr, setCntr] = useState(<div></div>);
  const [errorRegister, setErrorRegister] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const navigate = useNavigate();

  const [registerDetails, setRegisterDetails] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });

  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterDetails((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails((prev) => {
      return { ...prev, [name]: value };
    });
  }

  const toggler = () => {
    // console.log(cntr)
    cntr.classList.toggle("sign-in");
    cntr.classList.toggle("sign-up");
  };

  useEffect(() => {
    let container = document.getElementById("container");
    setCntr(container);

    setTimeout(() => {
      container.classList.add("sign-in");
    }, 200);
  }, []);


  const register = async (e) => {
    e.preventDefault();
    try {
      if (registerDetails.password === registerDetails.password2) {
        const res = await axios.post('http://localhost:5000/api/v1/user/register/',
          {
            name: registerDetails.username,
            email: registerDetails.email,
            password: registerDetails.password
          })
        // console.log(res);

        if (res.data.status) {
          console.log(res.data);
          // localStorage.setItem('user', JSON.stringify(res.data.result.user))
          Swal.fire(
            'Registration Successful',
            'You have to login now',
            'success'
          )          
          toggler();
        } else {
          setErrorRegister(res.data.result.message);
          setRegisterDetails({
            username: '',
            email: '',
            password: '',
            password2: ''
          });
        }
      }
      else {
        setErrorRegister('Passwords do not match!');
        setRegisterDetails({
          username: '',
          email: '',
          password: '',
          password2: ''
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/login/',
        {
          email: loginDetails.email,
          password: loginDetails.password
        })

      if (res.data.status) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        Swal.fire(
          'Login Successful',
          'success'
        ) 
        navigate("/");
      } else {
        setErrorLogin('Invalid Credentials!')
        setLoginDetails({
          email: '',
          password: '',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Login Failed!",
      })
      console.log(error);
    }
  }

  return (
    <div>
      <div id="container" className="container">
        {/* Form Section */}
        <div className="row">
          {/* Sign-up */}
          <div className="col align-items-center flex-col sign-up">
            <form className="form-wrapper align-items-center">
              <div className="form sign-up">
                <div className="input-group">
                  <div className="align-items-center error" >{errorRegister}</div>
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-user" />
                  <input type="text" placeholder="Username" onChange={handleRegisterChange} name='username' value={registerDetails.username} required />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-envelope" />
                  <input type="email" placeholder="Email" onChange={handleRegisterChange} name='email' value={registerDetails.email} required />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock" />
                  <input type="password" placeholder="Password" onChange={handleRegisterChange} name='password' value={registerDetails.password} required />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock" />
                  <input type="password" placeholder="Confirm password" onChange={handleRegisterChange} name='password2' value={registerDetails.password2} required />
                </div>
                <button type="submit" onClick={register}>Sign up</button>
                <p>
                  <span>Already have an account? &nbsp;</span>
                  <b onClick={toggler} className="pointer">
                    Sign in here
                  </b>
                </p>
              </div>
            </form>
          </div>
          {/* End of Sign-up */}

          {/* Sign-in */}
          <div className="col align-items-center flex-col sign-in">
            <form className="form-wrapper align-items-center">
              <div className="form sign-in">
                <div className="input-group">
                  <div className="align-items-center error" >{errorLogin}</div>
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-user" />
                  <input type="email" placeholder="Email" onChange={handleLoginChange} name='email' value={loginDetails.email} required />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-lock" />
                  <input type="password" placeholder="Password" onChange={handleLoginChange} name='password' value={loginDetails.password} required />
                </div>
                <button type="submit" onClick={login}>Sign in</button>
                <p>
                  <b>Forgot password?</b>
                </p>
                <p>
                  <span>Don't have an account? &nbsp;</span>
                  <b onClick={toggler} className="pointer">
                    Sign up here
                  </b>
                </p>
              </div>
            </form>
            <div className="form-wrapper"></div>
          </div>
          {/* End of Sign-in */}
        </div>
        {/* End of Form Section */}

        {/* Content Section */}
        <div className="row content-row">
          {/* Sign-in Content */}
          <div className="col align-items-center flex-col">
            <div className="text sign-in">
              <h2>Welcome Back!</h2>
            </div>
            <div className="img sign-in"></div>
          </div>
          {/* End of Sign-in Content */}

          {/* Sign-up Content */}
          <div className="col align-items-center flex-col">
            <div className="img sign-up"></div>
            <div className="text sign-up">
              <h2>Welcome!</h2>
              <h2>Join us here</h2>
            </div>
          </div>
          {/* End of Sign-up Content */}
        </div>
        {/* End of Content Section */}
      </div>
    </div>
  );
}

export default Onboarding