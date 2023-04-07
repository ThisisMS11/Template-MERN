import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import Swal from 'sweetalert2'
import './navbar.css';
import axios from 'axios'   


const Navbar = () => {

    const [toggleMenu, setToggleMenu] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        Swal.fire({
            title: 'Do you really want to Logout?',
            confirmButtonColor: '#4aaffd',
            showCancelButton: true,
            confirmButtonText: 'Logout',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */

            
            if (result.isConfirmed) {
                Swal.fire('Logged Out!', '', 'success')
                localStorage.removeItem("user");
                navigate("/login");
            }
        });
    }

    const Menu = () => {
        return (<>
            <p><a href={'#home'}>Home</a></p>
            <p><a href={'#about'}>About</a></p>
            <p><a href={'#projects'}>Projects</a></p>
            <p><a href={'#features'}>Features</a></p>
            <p><a href={'#blog'}>Blog</a></p>
        </>)
    }

    return (
        <div className="navbar">
            <div className="navbar-links">
                <div className="navbar-links_logo">
                    {/* <img src={logo} alt="logo" /> */}
                    <h1>Heading</h1>
                </div>
                <div className="navbar-links_container">
                    <Menu />
                </div>
            </div>
            <div className="navbar-sign">
                <button type="button" onClick={logout}>Logout</button>
            </div>
            <div className="navbar-menu">
                {toggleMenu ? (
                    <RiCloseLine
                        color="black"
                        size={27}
                        onClick={() => setToggleMenu(false)}
                    />
                ) : (
                    <RiMenu3Line
                        color="black"
                        size={27}
                        onClick={() => setToggleMenu(true)}
                    />
                )}
                {toggleMenu && (
                    <div className="navbar-menu_container scale-up-center">
                        <div className="navbar-menu_container-links">
                            <Menu />
                            <div className="navbar-menu_container-links-sign">
                                <button type="button" onClick={logout}>Logout</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;