var productDSL20C = {
    "elements": [
        "pipe",
        "logo",
        "legs",
        "baseCase",
        "frontFabric",
        "frontPanel",
        "backPanel",
        "handle",

    ],
    "interactiveElements": [
        {
            "name": "Input",
            "description": "Lorem ipsum esum...",
            "material": inputMultiMaterial,
            "texture": "",

        },
        {
            "name": "Classic Gain",
            "description": "Lorem ipsum esum...",
            "material": knobMultiMaterial,
            "texture": "",

        },
        {
            "name": "Classic Gain Volume",
            "description": "Lorem ipsum esum...",
            "material": knobMultiMaterial,
            "texture": "",

        },
        {
            "name": "Channel Select",
            "description": "Lorem ipsum esum...",
            "material": channelSelectMat,
            "texture": "",

        },
        {
            "name": "Ultra Gain",
            "description": "Lorem ipsum esum...",
            "material": knobMultiMaterial,
            "texture": "",

        },
        {
            "name": "Ultra Gain Volume",
            "description": "Lorem ipsum esum...",
            "material": knobMultiMaterial,
            "texture": "",

        },
    ]
}

var interactiveElements = IntereactiveView.Product.CreateNewElements(["front_panel_input", "classic_gain", "classic_gain_volume", "channel_select", "ultra_gain", "ultra_gain_volume", "tone_shift", "equalisation_treble",
            "equalisation_middle", "equalisation_bass", "equalisation_presence", "equalisation_resonance", "equalisation_reverb", "stb", "switch_output", "switch_power"]);

var interactiveElements = IntereactiveView.Product.CreateNewElements(["power_socket", "fx_loop_return", "fx_loop_send", "fs", "line_mp3_in", "emulated_out", "loudspeakers_1x8_a", "loudspeakers_1x8b",
"loudspeakers_1x16", "cable"]);            

material = inputMultiMaterial;               // Input
material = knobMultiMaterial;                // Classic Gain
material = knobMultiMaterial;                // Classic Gain Volume
material = channelSelectMat;                 // Channel Select
material = knobMultiMaterial;                // Ultra Gain
material = knobMultiMaterial;                // Ultra Gain Volume
material = channelSelectMat;                 // Tone Shift
material = knobMultiMaterial;                // Equalisation Treble
material = knobMultiMaterial;                // Equalisation Middle
material = knobMultiMaterial;                // Equalisation Bass
material = knobMultiMaterial;               // Equalisation Presence
material = knobMultiMaterial;               // Equalisation Resonance
material = knobMultiMaterial;               // Equalisation Reverb
material = channelSelectMat;                // STB
material = outputSwitchMultiMaterial;       // Output Switch
material = powerSwitchMultiMaterial;        // Power Switch
material = powerSocketMultiMat;      // Power Socket
material = fxLoopMultiMat;           // FX Loop Return
material = fxLoopMultiMat;           // FX Loop Send
material = fsMultiMat;               // FS
material = emulatedOutMultiMat;      // Line MP3 In
material = emulatedOutMultiMat;      // Emulated Out
material = loudspeakerMultiMat;      // Loudspeakers 1x8
material = loudspeakerMultiMat;      // Loudspeakers 1x8
material = loudspeakerMultiMat;      // Loudspeakers 1x16
material = cableMultiMat;            // Cable