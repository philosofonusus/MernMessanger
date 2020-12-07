
import React from 'react';

const Header = ({ name, thumbnail }) => {
   return (
      <header>
         <div className='px-10 py-3 d-flex'>
            <img className="circle mt-1" src={thumbnail} alt="" />
            <h2 className='name mw-max font-normal ml-5 mt-2'>{name}</h2>
            <div className="spacer"></div>
         </div>
      </header>
   );
}

export default Header;