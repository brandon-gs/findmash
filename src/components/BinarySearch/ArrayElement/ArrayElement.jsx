import React from 'react';
import './ArrayElement.css';

export default ({number}) => {
    return <div id={`binary-${number}`} className="binary__search--element">
        {number}
    </div>
}
