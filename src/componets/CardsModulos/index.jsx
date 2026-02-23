import React, { Fragment } from "react"


export const CardModulos = ({nome, alt, src, handleClick }) => {
  return (

    <Fragment>
      <div className="col-6 " >
        <a 
          href="" 
          onClick={handleClick}
          className="text-center p-1 m-1 d-flex flex-column hover-highlight"
          style={{ border: "1px solid #e5e5e5" }}
        >
          {/* <span class="profile-image rounded-circle d-block m-auto" ></span> */}
          <img
            src={src}
            className="profile-image  d-block m-auto"
            alt={alt}

          />
          <span className="d-block  mt-1"
            style={{ color: "#fff", fontWeight: 600, lineHeight: "25px", letterSpacing: "1px", textTransform: "uppercase" }}>{nome} </span>
        </a>
      </div>
    </Fragment>
  )
}