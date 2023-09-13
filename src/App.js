import React, { useState } from 'react';
import PortfolioContent from './PortfolioContent';

function App() {
    const [selectedStyle, setSelectedStyle] = useState("minimalist");

    return (
        <div>
            <PortfolioContent styleType={selectedStyle} onSelectStyle={setSelectedStyle} />
        </div>
    );
}

export default App;
