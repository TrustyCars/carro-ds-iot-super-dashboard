/* eslint-disable @typescript-eslint/no-non-null-assertion */

import React from 'react';
import { Link } from "react-router-dom";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { COLORS } from '../constants';
import "./header.css"

function Header(){

    const openNav=(id: string)=> {
        if(id=="leftdrawer"){
            document.getElementById(id)!.style.width = "250px";
            document.getElementById("map")!.style.marginLeft = "250px";
        }
      }
      
    const closeNav=(id: string)=> {
          if(id=="leftdrawer"){
            document.getElementById(id)!.style.width = "0";
            document.getElementById("map")!.style.marginLeft = "0";
          }
      }
    const renderNav=()=>{
      return(
        <div className="header-container">
          <div
            className="drawer-container left-icon"
            onClick={() => openNav("leftdrawer")}
            style={{ cursor: 'pointer' }}
          >
            <MenuRoundedIcon fontSize='large' />
          </div>
        </div>
      );
    };

    const renderLeftDrawer = () => (
      <div id="leftdrawer" className="sidenav left">
        <CloseRoundedIcon className="closebtn left-close" onClick={()=>closeNav("leftdrawer")} sx={{ fill: COLORS.WHITE }} />
        <Link
          style={{textDecoration: 'none', textAlign: 'center' }}
          to={`/${window.location.search}`}
          onClick={() => closeNav("leftdrawer")}>
          <p>Home</p>
        </Link>
        <Link
          style={{ textDecoration: 'none', textAlign: 'center' }}
          to={`/devices${window.location.search}`}
           onClick={() => closeNav("leftdrawer")}
        >
          <p>Devices</p>
        </Link>
        {/* <Link style={{textDecoration: 'none'}}   to="/drivers"  onClick={()=>closeNav("leftdrawer")} >
        <p>Drivers</p>
        </Link> */}
      </div>
    );

    const renderRightDrawer=()=>{
        return(
            <div id="rightdrawer" className="sidenav right">
                <div>
                <p className="closebtn right-close" onClick={()=>closeNav("rightdrawer")}>&times;</p>
                </div>
                <div>
                    <input className="search-box" placeholder="Search..." />
                </div>
            </div>
        )
    }

  return ( 
      <>
        {renderNav()}
        {renderLeftDrawer()}
        {renderRightDrawer()}
      </>

  );
}

export default Header;
