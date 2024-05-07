import React, { useState, useEffect } from "react";
import "./SetupForm.css";
import { processEvents, checkStatus } from "../api";

const colorOptions = [
    { id: "1", name: "Lavender", hex: "#7986cb" },
    { id: "2", name: "Sage", hex: "#33b679" },
    { id: "3", name: "Grape", hex: "#8e24aa" },
    { id: "4", name: "Flamingo", hex: "#e67c73" },
    { id: "5", name: "Banana", hex: "#f6c026" },
    { id: "6", name: "Tangerine", hex: "#f5511d" },
    { id: "7", name: "Peacock", hex: "#039be5" },
    { id: "8", name: "Graphite", hex: "#616161" },
    { id: "9", name: "Blueberry", hex: "#3f51b5" },
    { id: "10", name: "Basil", hex: "#0b8043" },
    { id: "11", name: "Tomato", hex: "#d60000" },
];

const blocks = ["A", "B", "C", "D", "E", "F"];
const otherBlocks = ["Chapel", "FLEX", "House Meetings"];

const SetupForm = () => {
    const [formData, setFormData] = useState({
        shareEmail: "",
        blockToClasses: {},
        blockToColors: {},
        humanitiesBlock: "",
        secondLunchBlocks: "",
        lunchColorId: "",
        defaultColorId: "",
    });

    const [links, setLinks] = useState({
        iCalLink: "",
        googleCalendarLink: "",
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [requestId, setRequestId] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (requestId) {
                checkStatus(requestId)
                    .then((data) => {
                        if (data.status === "completed") {
                            setLinks({
                                iCalLink: data.iCalLink,
                                googleCalendarLink: data.googleCalendarLink,
                            });
                            setResult("Setup complete!");
                            setLoading(false);
                            clearInterval(interval);
                        } else if (data.status === "failed") {
                            setResult("Error: " + data.message);
                            setLoading(false);
                            clearInterval(interval);
                        }
                    })
                    .catch((error) => {
                        setResult("Error checking status: " + error.message);
                        setLoading(false);
                    });
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [requestId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "shareEmail") {
            // Only trim spaces for the email, do not change case
            formattedValue = value.trim();
        } else if (name === "secondLunchBlocks" || name === "humanitiesBlock") {
            // Remove spaces and convert to uppercase for block identifiers
            formattedValue = value.replace(/\s+/g, "").toUpperCase();
        } else if (name.startsWith("blockToClasses")) {
            // Trim class names
            formattedValue = value.trim();
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };

    const handleBlockSetup = (key, value, type) => {
        const formattedValue = value;
        setFormData((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [key]: formattedValue,
            },
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validBlockRegex = /^[A-F]$/; // Regex to check if a single block is valid

        // Check if each block has a non-empty class name and color
        const allBlocksHaveData = blocks.every(
            (block) =>
                formData.blockToClasses[block] && formData.blockToColors[block]
        );

        // Check if each other block has a non-empty color
        const allOtherBlocksHaveColors = otherBlocks.every(
            (block) => formData.blockToColors[block]
        );

        // Validate Second Lunch Blocks to ensure only valid block letters separated by commas
        const secondLunchBlocksValid = formData.secondLunchBlocks
            .split(",")
            .map((block) => block.trim().toUpperCase()) // Normalize input
            .every(
                (block) =>
                    blocks.includes(block) && block.match(validBlockRegex)
            );

        // Validate Humanities Block to ensure it is either a valid block or empty
        const humanitiesBlockValid =
            formData.humanitiesBlock === "" ||
            (blocks.includes(formData.humanitiesBlock) &&
                formData.humanitiesBlock.match(validBlockRegex));

        return (
            emailRegex.test(formData.shareEmail.trim()) && // Validate the email address
            allBlocksHaveData &&
            allOtherBlocksHaveColors &&
            secondLunchBlocksValid &&
            humanitiesBlockValid &&
            formData.lunchColorId.trim() !== "" &&
            formData.defaultColorId.trim() !== ""
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult("Processing...");
        try {
            const response = await processEvents(formData);
            setRequestId(response.requestId); // Assuming the server returns a requestId
        } catch (error) {
            setResult(`Error: ${error.message}`);
            setLoading(false);
        }
    };

    const colorStyle = (colorId) => {
        const color = colorOptions.find((c) => c.id === colorId);
        return {
            backgroundColor: color ? color.hex : "transparent",
            color: color ? "#ffffff" : "inherit",
        };
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

            {blocks.map((block) => (
                <div className="block-section" key={block}>
                    <h4>{block + " Block"}</h4>
                    <input
                        type="text"
                        name={`blockToClasses[${block}]`}
                        value={formData.blockToClasses[block] || ""}
                        onChange={(e) =>
                            handleBlockSetup(
                                block,
                                e.target.value,
                                "blockToClasses"
                            )
                        }
                        placeholder={`Class name for ${block}`}
                    />
                    <select
                        name={`blockToColors[${block}]`}
                        value={formData.blockToColors[block] || ""}
                        onChange={(e) =>
                            handleBlockSetup(
                                block,
                                e.target.value,
                                "blockToColors"
                            )
                        }
                        style={colorStyle(formData.blockToColors[block])}
                    >
                        <option value="" hidden>
                            Select Color
                        </option>
                        {colorOptions.map((option) => (
                            <option
                                key={option.id}
                                value={option.id}
                                className="dropdown-option"
                                style={{
                                    backgroundColor: option.hex,
                                    color: "white",
                                }}
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="block-section">
                <h4>Humanities Block</h4>
                <input
                    type="text"
                    maxLength={1}
                    name="humanitiesBlock"
                    value={formData.humanitiesBlock.toUpperCase()}
                    onChange={handleChange}
                    placeholder="Enter your humanities or leave blank (e.g. E)"
                />
            </div>
            <div className="block-section">
                <h4>First Lunch Blocks</h4>
                <input
                    type="text"
                    name="secondLunchBlocks"
                    value={formData.secondLunchBlocks.toUpperCase()}
                    onChange={handleChange}
                    placeholder="Blocks with class during first lunch (e.g., A,B,C)"
                />
                <select
                    name="lunchColorId"
                    value={formData.lunchColorId || ""}
                    onChange={handleChange}
                    style={colorStyle(formData.lunchColorId)}
                >
                    <option value="" hidden>
                        Select Color
                    </option>
                    {colorOptions.map((option) => (
                        <option
                            key={option.id}
                            value={option.id}
                            className="dropdown-option"
                            style={{
                                backgroundColor: option.hex,
                                color: "white",
                            }}
                        >
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            {otherBlocks.map((block) => (
                <div className="block-section" key={block}>
                    <h4>{block}</h4>

                    <select
                        name={`blockToColors[${block}]`}
                        value={formData.blockToColors[block] || ""}
                        onChange={(e) =>
                            handleBlockSetup(
                                block,
                                e.target.value,
                                "blockToColors"
                            )
                        }
                        style={colorStyle(formData.blockToColors[block])}
                    >
                        <option value="" hidden>
                            Select Color
                        </option>
                        {colorOptions.map((option) => (
                            <option
                                key={option.id}
                                value={option.id}
                                className="dropdown-option"
                                style={{
                                    backgroundColor: option.hex,
                                    color: "white",
                                }}
                            >
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            <div className="block-section">
                <h4>Default</h4>
                <select
                    name="defaultColorId"
                    value={formData.defaultColorId || ""}
                    onChange={handleChange}
                    style={colorStyle(formData.defaultColorId)}
                >
                    <option value="" hidden>
                        Select Color
                    </option>
                    {colorOptions.map((option) => (
                        <option
                            key={option.id}
                            value={option.id}
                            className="dropdown-option"
                            style={{
                                backgroundColor: option.hex,
                                color: "white",
                            }}
                        >
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

            {!loading && !result && (
                <div className="button-container">
                    <button type="submit" disabled={!validateForm()}>
                        Finish Setup
                    </button>
                </div>
            )}

            {loading && (
                <div className="button-container">
                    <div>Loading...</div>
                </div>
            )}

            {(result && !loading) && (
                <div className="result">
                    <div>{result}</div>
                    {links.iCalLink && (
                        <div>
                            <a
                                href={links.iCalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {"iCal download link"}
                            </a>
                        </div>
                    )}
                    {links.googleCalendarLink && (
                        <div>
                            
                            <a
                                href={links.googleCalendarLink}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {"Google calendar link"}
                            </a>
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

export default SetupForm;
