import React, { useState } from 'react';
import './SetupForm.css'; // CSS for styling

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
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        shareEmail: '',
        blocks: [],
        blockColors: {},
        humanitiesBlock: '',
        firstLunchBlocks: '',
        lunchColorId: '',
        otherBlocks: ['Chapel', 'FLEX', 'House Meetings'],
        otherBlockColors: {},
        defaultColorId: ''
    });

    const handleNextStep = () => setStep(step + 1);
    const handlePreviousStep = () => setStep(step - 1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBlockSetup = (block, value) => {
        const updatedBlocks = { ...formData.blocks, [block]: value };
        setFormData({ ...formData, blocks: updatedBlocks });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted Data', formData);
        // API call to process the data
    };

    const renderForm = () => {
        switch(step) {
            case 0:
                return (
                    <div>
                        <label>Email to Share Calendar:</label>
                        <input
                            type="email"
                            name="shareEmail"
                            value={formData.shareEmail}
                            onChange={handleChange}
                            placeholder="Enter email"
                        />
                        <button onClick={handleNextStep}>Next</button>
                    </div>
                );
            case 1:
                return (
                    <div>
                        {['A', 'B', 'C', 'D', 'E', 'F'].map(block => (
                            <div key={block}>
                                <label>{`Block ${block} Name and Color:`}</label>
                                <input
                                    type="text"
                                    name={`block${block}Name`}
                                    value={formData.blocks[block] ? formData.blocks[block].name : ''}
                                    onChange={(e) => handleBlockSetup(block, { ...formData.blocks[block], name: e.target.value })}
                                    placeholder={`Name for block ${block}`}
                                />
                                <select
                                    name={`block${block}Color`}
                                    value={formData.blocks[block] ? formData.blocks[block].colorId : ''}
                                    onChange={(e) => handleBlockSetup(block, { ...formData.blocks[block], colorId: e.target.value })}
                                >
                                    <option value="">Select Color</option>
                                    {colorOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <button onClick={handlePreviousStep}>Back</button>
                        <button onClick={handleNextStep}>Next</button>
                    </div>
                );
                case 2:
                    return (
                        <div>
                            <label>Which block is the Humanities block?</label>
                            <select
                                name="humanitiesBlock"
                                value={formData.humanitiesBlock}
                                onChange={handleChange}
                            >
                                <option value="">Select Block</option>
                                {['A', 'B', 'C', 'D', 'E', 'F'].map(block => (
                                    <option key={block} value={block}>{`Block ${block}`}</option>
                                ))}
                            </select>
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Next</button>
                        </div>
                    );
                case 3:
                    return (
                        <div>
                            <label>Enter the blocks that have class during the first lunch block:</label>
                            <input
                                type="text"
                                name="firstLunchBlocks"
                                value={formData.firstLunchBlocks}
                                onChange={handleChange}
                                placeholder="Enter blocks (e.g., A,B,C)"
                            />
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Next</button>
                        </div>
                    );
                case 4:
                    return (
                        <div>
                            <label>Choose a color ID for Lunch:</label>
                            <select
                                name="lunchColorId"
                                value={formData.lunchColorId}
                                onChange={handleChange}
                            >
                                <option value="">Select Color</option>
                                {colorOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Next</button>
                        </div>
                    );
                case 5:
                    return (
                        <div>
                            {formData.otherBlocks.map(otherBlock => (
                                <div key={otherBlock}>
                                    <label>{`Choose a color ID for ${otherBlock}:`}</label>
                                    <select
                                        name={otherBlock}
                                        value={formData.otherBlockColors[otherBlock]}
                                        onChange={e => handleChange({ target: { name: 'otherBlockColors', value: { ...formData.otherBlockColors, [otherBlock]: e.target.value } }})}
                                    >
                                        <option value="">Select Color</option>
                                        {colorOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={handleNextStep}>Next</button>
                        </div>
                    );
                case 6:
                    return (
                        <div>
                            <label>Choose a default color ID for events:</label>
                            <select
                                name="defaultColorId"
                                value={formData.defaultColorId}
                                onChange={handleChange}
                            >
                                <option value="">Select Color</option>
                                {colorOptions.map(option => (
                                    <option key={option.id} value={option.id}>{option.name}</option>
                                ))}
                            </select>
                            <button onClick={handlePreviousStep}>Back</button>
                            <button onClick={() => {
                                handleNextStep();
                                handleSubmit();
                            }}>Finish Setup</button>
                        </div>
                    );
                default:
                    return (
                        <div>
                            <h2>Configuration Complete!</h2>
                            <button onClick={() => setStep(0)}>Restart</button>
                        </div>
                    );
                }
    };

    return (
        <form onSubmit={handleSubmit} className="setup-form">
            {renderForm()}
        </form>
    );
};

export default SetupForm;
