import React, { useState } from 'react';
import './SetupForm.css'; // Make sure this CSS file is correctly linked
import { processEvents } from '../api'; // Importing the processEvents function

const colorOptions = [
    { id: '1', name: "Lavender", hex: "#7986cb" },
    { id: '2', name: "Sage", hex: "#33b679" },
    { id: '3', name: "Grape", hex: "#8e24aa" },
    { id: '4', name: "Flamingo", hex: "#e67c73" },
    { id: '5', name: "Banana", hex: "#f6c026" },
    { id: '6', name: "Tangerine", hex: "#f5511d" },
    { id: '7', name: "Peacock", hex: "#039be5" },
    { id: '8', name: "Graphite", hex: "#616161" },
    { id: '9', name: "Blueberry", hex: "#3f51b5" },
    { id: '10', name: "Basil", hex: "#0b8043" },
    { id: '11', name: "Tomato", hex: "#d60000" },
];

const blocks = ["A", "B", "C", "D", "E", "F"];
const otherBlocks = ["Chapel", "FLEX", "House Meetings"];

const SetupForm = () => {
    const [formData, setFormData] = useState({
        shareEmail: '',
        blockToClasses: {},
        blockToColors: {},
        humanitiesBlock: '',
        secondLunchBlocks: '',
        lunchColorId: '',
        defaultColorId: ''
    });
    const [links, setLinks] = useState({ iCalLink: '', googleCalendarLink: '' });


    const [result, setResult] = useState(''); // State to store API response message


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlockSetup = (key, value, type) => {
        setFormData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult("Processing...");
        try {
            const response = await processEvents(formData);
            setResult(`Success: Events processed and calendar created.`);
            setLinks({ iCalLink: response.iCalLink, googleCalendarLink: response.googleCalendarLink });
        } catch (error) {
            setResult(`Error: ${error.message}`);
            setLinks({ iCalLink: '', googleCalendarLink: '' });
        }
    };


    const colorStyle = (colorId) => {
        const color = colorOptions.find(c => c.id === colorId);
        return { backgroundColor: color ? color.hex : 'transparent' };
    };

    return (
        <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
            <h4>{"Email"}</h4>
                <input
                    name="shareEmail"
                    value={formData.shareEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                />
            </div>

            {blocks.map(block => (
                <div className="block-section" key={block}>
                    <h4>{block + " Block"}</h4>
                    <input
                        type="text"
                        name={`blockToClasses[${block}]`}
                        value={formData.blockToClasses[block] || ''}
                        onChange={(e) => handleBlockSetup(block, e.target.value, 'blockToClasses')}
                        placeholder={`Class name for ${block}`}
                    />
                    <select
                        name={`blockToColors[${block}]`}
                        value={formData.blockToColors[block] || ''}
                        onChange={(e) => handleBlockSetup(block, e.target.value, 'blockToColors')}
                        style={colorStyle(formData.blockToColors[block])}
                    >
                        <option value="" hidden>Select Color</option>
                        {colorOptions.map(option => (
                            <option key={option.id} value={option.id} className='dropdown-option' style={{ backgroundColor: option.hex, color: 'black'}}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

{otherBlocks.map(block => (
                <div className="block-section" key={block}>
                    <h4>{block }</h4>
                   
                    <select
                        name={`blockToColors[${block}]`}
                        value={formData.blockToColors[block] || ''}
                        onChange={(e) => handleBlockSetup(block, e.target.value, 'blockToColors')}
                        style={colorStyle(formData.blockToColors[block])}
                    >
                        <option value="" hidden>Select Color</option>
                        {colorOptions.map(option => (
                            <option key={option.id} value={option.id} className='dropdown-option' style={{ backgroundColor: option.hex, color: 'black'}}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="block-section">
                <h4>Lunch</h4>
                <input
                    type="text"
                    name="secondLunchBlocks"
                    value={formData.secondLunchBlocks}
                    onChange={handleChange}
                    placeholder="Blocks with class during first lunch (e.g., A,B,C)"
                />
                <select
                    name="lunchColorId"
                    value={formData.lunchColorId || ''}
                    onChange={handleChange}
                    style={colorStyle(formData.lunchColorId)}
                >
                    <option value="">Select Color</option>
                    {colorOptions.map(option => (
                        <option key={option.id} value={option.id} className='dropdown-option'style={{ backgroundColor: option.hex, color: '#fff' }}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="block-section">
                <h4>Default</h4>
                <select
                    name="defaultColorId"
                    value={formData.defaultColorId || ''}
                    onChange={handleChange}
                    style={colorStyle(formData.defaultColorId)}
                >
                    <option value="">Select Color</option>
                    {colorOptions.map(option => (
                        <option key={option.id} value={option.id} className='dropdown-option' style={{ backgroundColor: option.hex, color: '#fff' }}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>


            <div className="button-container">
                <button type="submit">Finish Setup</button>
            </div>
            
            <div className="result">
                {result && <div>{result}</div>}
                {links.iCalLink && <div>iCal Link: <a href={links.iCalLink} target="_blank" rel="noopener noreferrer">{links.iCalLink}</a></div>}
                {links.googleCalendarLink && <div>Google Calendar: <a href={links.googleCalendarLink} target="_blank" rel="noopener noreferrer">{links.googleCalendarLink}</a></div>}
            </div>
        </form>
    );
};

export default SetupForm;
