import React, { useState } from 'react';
import './SetupForm.css'; // Ensure this CSS file is present

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

const SetupForm = () => {
    const [formData, setFormData] = useState({
        shareEmail: '',
        blockToClasses: {},
        blockToColors: {},
        humanitiesBlock: '',
        secondLunchBlocks: '',
        lunchColorId: '',
        otherBlockColors: {
            Chapel: '',
            FLEX: '',
            'House Meetings': ''
        },
        defaultColorId: ''
    });

    // Handles text input and selects for non-block data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handles block color selection for both blockToColors and otherBlockColors
    const handleBlockColorChange = (block, value, isOtherBlock = false) => {
        if (isOtherBlock) {
            setFormData(prev => ({
                ...prev,
                otherBlockColors: {
                    ...prev.otherBlockColors,
                    [block]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                blockToColors: {
                    ...prev.blockToColors,
                    [block]: value
                }
            }));
        }
    };

    // Handles form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data:', formData);
        // Implement your API call here
    };

    return (
        <form onSubmit={handleSubmit} className="setup-form">
            <div className="form-group">
                <label>Email to Share Calendar:</label>
                <input
                    type="email"
                    name="shareEmail"
                    value={formData.shareEmail}
                    onChange={handleChange}
                    placeholder="Enter email"
                />
            </div>

            {/* Loop through primary block names for color selection */}
            {['A', 'B', 'C', 'D', 'E', 'F'].map(block => (
                <div className="form-group" key={block}>
                    <label>{`Color for Block ${block}:`}</label>
                    <select
                        name={`blockToColors[${block}]`}
                        value={formData.blockToColors[block] || ''}
                        onChange={(e) => handleBlockColorChange(block, e.target.value)}
                    >
                        <option value="">Select Color</option>
                        {colorOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="form-group">
                <label>Color ID for Lunch:</label>
                <select
                    name="lunchColorId"
                    value={formData.lunchColorId}
                    onChange={handleChange}
                >
                    <option value="">Select Color</option>
                    {colorOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loop through additional blocks like Chapel, FLEX, House Meetings */}
            {['Chapel', 'FLEX', 'House Meetings'].map(block => (
                <div className="form-group" key={block}>
                    <label>{`Color for ${block}:`}</label>
                    <select
                        name={`otherBlockColors[${block}]`}
                        value={formData.otherBlockColors[block] || ''}
                        onChange={(e) => handleBlockColorChange(block, e.target.value, true)}
                    >
                        <option value="">Select Color</option>
                        {colorOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="form-group">
                <label>Default Color for Events:</label>
                <select
                    name="defaultColorId"
                    value={formData.defaultColorId}
                    onChange={handleChange}
                >
                    <option value="">Select Color</option>
                    {colorOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="button-container">
                <button type="submit">Finish Setup</button>
            </div>
        </form>
    );
};

export default SetupForm;
