var IntereactiveView = IntereactiveView || {};
IntereactiveView.Loader = IntereactiveView.Loader || {};

$(function (ns) {
    IntereactiveView.Loader.LoadProduct = function(scene, product) {
        CreateCase(scene, product);
        CreateFrontFabric(scene, product);
        CreateFrontPanel(scene, product);
        CreateBackPanel(scene, product);
        CreateCorners(scene, product);
        CreateHandle(scene, product);

        // Create Pipe
        var pipeMaterial = new BABYLON.StandardMaterial("material", scene);
        pipeMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        pipeMaterial.specularIntensity = 0.1;
        pipeMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

        var pipe = new IntereactiveView.Product.CreateNewElement("pipe_front");
        pipe.material = pipeMaterial;

        product.elements.push(pipe);

        // Create Logo
        var logoMaterial = new BABYLON.StandardMaterial("material", scene);
        logoMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

        var logo = new IntereactiveView.Product.CreateNewElement("logo");
        logo.material = logoMaterial;

        product.elements.push(logo);

        // Create Legs
        var legsMaterial = new BABYLON.StandardMaterial("material", scene);
        legsMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var legs = new IntereactiveView.Product.CreateNewElement("legs");
        legs.material = legsMaterial;

        product.elements.push(legs);

        IntereactiveView.Site.LoadElements(scene);
    }

    function CreateCase(scene, product) {
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("resources/reflectionmap.dds", scene);

        var caseMat = new BABYLON.StandardMaterial("case", scene);
        caseMat.diffuseTexture = new BABYLON.Texture("resources/leather1.jpg", scene);
        caseMat.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        caseMat.diffuseTexture.uScale = 3.0;
        caseMat.diffuseTexture.vScale = 3.0;

        caseMat.bumpTexture = new BABYLON.Texture("resources/leather1_bump.jpg", scene);
        caseMat.bumpTexture.uScale = 3.0;
        caseMat.bumpTexture.vScale = 3.0;
        caseMat.bumpTexture.level = 0.5;

        caseMat.specularColor = new BABYLON.Color3(0.06, 0.06, 0.06);
        caseMat.enableSpecularAntiAliasing = true;
        caseMat.specularPower = 100;

        var backInsideMat = new BABYLON.StandardMaterial("backInside", scene);
        backInsideMat.diffuseTexture = new BABYLON.Texture("resources/dsl20c_back_inside.jpg", scene);
        backInsideMat.specularColor = new BABYLON.Color3(0, 0, 0);
        backInsideMat.specularIntensity = 0;

        var backCaseScrewsMat = new BABYLON.PBRMaterial("metal", scene);
        backCaseScrewsMat.reflectionTexture = hdrTexture;
        backCaseScrewsMat.reflectionColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        backCaseScrewsMat.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        backCaseScrewsMat.roughness = 0.3;
        backCaseScrewsMat.metallic = 1.1;
        backCaseScrewsMat.specularIntensity = 0.4;
        backCaseScrewsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var topCaseScrewsMat = new BABYLON.PBRMaterial("metal", scene);
        topCaseScrewsMat.reflectionTexture = hdrTexture;
        topCaseScrewsMat.reflectionColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        topCaseScrewsMat.albedoColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        topCaseScrewsMat.roughness = 0.3;
        topCaseScrewsMat.metallic = 1.1;
        topCaseScrewsMat.specularIntensity = 0.4;
        topCaseScrewsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var multiMaterial = new BABYLON.MultiMaterial("multi", scene);
        multiMaterial.subMaterials.push(caseMat);
        multiMaterial.subMaterials.push(backInsideMat);
        multiMaterial.subMaterials.push(backCaseScrewsMat);
        multiMaterial.subMaterials.push(topCaseScrewsMat);

        var baseCase = new IntereactiveView.Product.CreateNewElement("case");
        baseCase.material = multiMaterial;

        product.elements.push(baseCase);
    }

    function CreateFrontFabric(scene, product) {
        var material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseTexture = new BABYLON.Texture("resources/frets1.jpg", scene);
        material.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

        var frontFabric = new IntereactiveView.Product.CreateNewElement("front_fabric");
        frontFabric.material = material;

        product.elements.push(frontFabric);
    }

    function CreateFrontPanel(scene, product) {

        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("resources/reflectionmap.dds", scene);

        // Panel
        var panelMat = new BABYLON.StandardMaterial("panel", scene);
        panelMat.diffuseTexture = new BABYLON.Texture("resources/dsl20c_front_panel.jpg", scene);
        panelMat.specularColor = new BABYLON.Color3(0.394, 0.288, 0.211);
        panelMat.specularIntensity = 0.02;

        // Input
        var inputMat1 = new BABYLON.StandardMaterial("input2", scene);
        inputMat1.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        inputMat1.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        inputMat1.specularIntensity = 0.2;

        var inputMat2 = new BABYLON.PBRMaterial("metal", scene);
        inputMat2.reflectionTexture = hdrTexture;
        inputMat2.reflectionColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        inputMat2.albedoColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        inputMat2.roughness = 0.16;
        inputMat2.metallic = 1.1;
        inputMat2.specularIntensity = 0.4;
        inputMat2.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var inputMat3 = new BABYLON.StandardMaterial("input3", scene);
        inputMat3.diffuseColor = new BABYLON.Color3(0, 0, 0);
        inputMat3.specularColor = new BABYLON.Color3(0, 0, 0);
        inputMat3.specularIntensity = 0.0;

        var inputMultiMaterial = new BABYLON.MultiMaterial("multi", scene);
        inputMultiMaterial.subMaterials.push(inputMat1);
        inputMultiMaterial.subMaterials.push(inputMat2);
        inputMultiMaterial.subMaterials.push(inputMat3);

        // Knob
        var knobBaseMat = new BABYLON.StandardMaterial("knobBase", scene);
        knobBaseMat.diffuseColor = new BABYLON.Color3(0.06, 0.06, 0.06);
        knobBaseMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        knobBaseMat.specularIntensity = 0.1;

        var knobMetalMat = new BABYLON.PBRMaterial("metal", scene);
        knobMetalMat.reflectionTexture = hdrTexture;
        knobMetalMat.reflectionColor = new BABYLON.Color3(0.729, 0.75851, 0.5628);
        knobMetalMat.albedoColor = new BABYLON.Color3(1.0, 1.0, 0.8);
        knobMetalMat.specularColor = new BABYLON.Color3(1.0, 1.0, 0.8);
        knobMetalMat.specularIntensity = 0.1;
        knobMetalMat.roughness = 0.3;
        knobMetalMat.metallic = 1.3;

        var knobIndicatorMat = new BABYLON.StandardMaterial("knobIndicator", scene);
        knobIndicatorMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        knobIndicatorMat.specularColor = new BABYLON.Color3(0.06, 0.06, 0.06);
        knobIndicatorMat.specularIntensity = 0.1;

        var knobMultiMaterial = new BABYLON.MultiMaterial("multi", scene);
        knobMultiMaterial.subMaterials.push(knobBaseMat);
        knobMultiMaterial.subMaterials.push(knobMetalMat);
        knobMultiMaterial.subMaterials.push(knobIndicatorMat);

        // Channel Select, Tone Shift, STB
        var channelSelectMat = new BABYLON.StandardMaterial("channelSelect", scene);
        channelSelectMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        channelSelectMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        channelSelectMat.specularIntensity = 0;

        // Output Switch
        var outputSwitchMat1 = new BABYLON.StandardMaterial("outputSwitch1", scene);
        outputSwitchMat1.diffuseColor = new BABYLON.Color3(0.01, 0.01, 0.01);
        outputSwitchMat1.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        outputSwitchMat1.specularIntensity = 0.1;

        var outputSwitchMat2 = new BABYLON.StandardMaterial("outputSwitch2", scene);
        outputSwitchMat2.diffuseColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        outputSwitchMat2.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        outputSwitchMat2.specularIntensity = 0.2;

        var outputSwitchMultiMaterial = new BABYLON.MultiMaterial("multi", scene);
        outputSwitchMultiMaterial.subMaterials.push(outputSwitchMat1);
        outputSwitchMultiMaterial.subMaterials.push(outputSwitchMat2);

        // Power Switch
        var powerSwitchMat2 = new BABYLON.StandardMaterial("powerSwitch2", scene);
        powerSwitchMat2.diffuseColor = new BABYLON.Color3(0.7, 0.05, 0.05);
        powerSwitchMat2.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        powerSwitchMat2.specularIntensity = 0.2;

        var powerSwitchMultiMaterial = new BABYLON.MultiMaterial("multi", scene);
        powerSwitchMultiMaterial.subMaterials.push(outputSwitchMat1);
        powerSwitchMultiMaterial.subMaterials.push(powerSwitchMat2);

        var frontPanel = new IntereactiveView.Product.CreateNewElement("front_panel");
        frontPanel.material = panelMat;

        var interactiveElements = IntereactiveView.Product.CreateNewElements(["front_panel_input", "classic_gain", "classic_gain_volume", "channel_select", "ultra_gain", "ultra_gain_volume", "tone_shift", "equalisation_treble",
            "equalisation_middle", "equalisation_bass", "equalisation_presence", "equalisation_resonance", "equalisation_reverb", "stb", "switch_output", "switch_power"]);

        for (i = 0; i < interactiveElements.length; i++)
        {
            var element = interactiveElements[i];
            element.isInteractable = true;
        }

        interactiveElements[0].material = inputMultiMaterial;               // Input
        interactiveElements[1].material = knobMultiMaterial;                // Classic Gain
        interactiveElements[2].material = knobMultiMaterial;                // Classic Gain Volume
        interactiveElements[3].material = channelSelectMat;                 // Channel Select
        interactiveElements[4].material = knobMultiMaterial;                // Ultra Gain
        interactiveElements[5].material = knobMultiMaterial;                // Ultra Gain Volume
        interactiveElements[6].material = channelSelectMat;                 // Tone Shift
        interactiveElements[7].material = knobMultiMaterial;                // Equalisation Treble
        interactiveElements[8].material = knobMultiMaterial;                // Equalisation Middle
        interactiveElements[9].material = knobMultiMaterial;                // Equalisation Bass
        interactiveElements[10].material = knobMultiMaterial;               // Equalisation Presence
        interactiveElements[11].material = knobMultiMaterial;               // Equalisation Resonance
        interactiveElements[12].material = knobMultiMaterial;               // Equalisation Reverb
        interactiveElements[13].material = channelSelectMat;                // STB
        interactiveElements[14].material = outputSwitchMultiMaterial;       // Output Switch
        interactiveElements[15].material = powerSwitchMultiMaterial;        // Power Switch
        
        IntereactiveView.Product.PushNewInteractiveElements(product, interactiveElements);
        product.elements.push(frontPanel);
    }

    function CreateBackPanel(scene, product)
    {
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("resources/reflectionmap.dds", scene);

        // Panel
        var panelMat = new BABYLON.StandardMaterial("panel", scene);
        panelMat.diffuseTexture = new BABYLON.Texture("resources/dsl15c-20-vb_back_panel.jpg", scene);
        panelMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        panelMat.specularIntensity = 0.02;

        // Black Hole
        var blackHoleMat = new BABYLON.StandardMaterial("blackHole", scene);
        blackHoleMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        blackHoleMat.specularColor = new BABYLON.Color3(0, 0, 0);
        blackHoleMat.specularIntensity = 0;

        // Line MP3 and Emulated Out
        var emulatedOutMat = new BABYLON.StandardMaterial("emulatedOut", scene);
        emulatedOutMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        emulatedOutMat.specularColor = new BABYLON.Color3(0.001, 0.001, 0.001);
        emulatedOutMat.specularIntensity = 0;

        var emulatedOutMultiMat = new BABYLON.MultiMaterial("multi", scene);
        emulatedOutMultiMat.subMaterials.push(emulatedOutMat);
        emulatedOutMultiMat.subMaterials.push(blackHoleMat);

        // Loudspeakers (Red)
        var loudspeakerMat = new BABYLON.StandardMaterial("mat1", scene);
        loudspeakerMat.diffuseColor = new BABYLON.Color3(0.384, 0.096, 0.128);
        loudspeakerMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        loudspeakerMat.specularIntensity = 0.02;

        var loudspeakerMultiMat = new BABYLON.MultiMaterial("multi", scene);
        loudspeakerMultiMat.subMaterials.push(loudspeakerMat);
        loudspeakerMultiMat.subMaterials.push(emulatedOutMat);
        loudspeakerMultiMat.subMaterials.push(blackHoleMat);

        // F/S (White)
        var fsMat = new BABYLON.StandardMaterial("fs", scene);
        fsMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        fsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        fsMat.specularIntensity = 0.02;

        var fsMultiMat = new BABYLON.MultiMaterial("multi", scene);
        fsMultiMat.subMaterials.push(fsMat);
        fsMultiMat.subMaterials.push(emulatedOutMat);
        fsMultiMat.subMaterials.push(blackHoleMat);

        // FX Loop
        var fxLoopMat = new BABYLON.StandardMaterial("fxloop", scene);
        fxLoopMat.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        fxLoopMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        fxLoopMat.specularIntensity = 0.02;

        var fxLoopMultiMat = new BABYLON.MultiMaterial("multi", scene);
        fxLoopMultiMat.subMaterials.push(fxLoopMat);
        fxLoopMultiMat.subMaterials.push(emulatedOutMat);
        fxLoopMultiMat.subMaterials.push(blackHoleMat);

        // Power Socket
        var powerSocketMat = new BABYLON.StandardMaterial("powerSocket", scene);
        powerSocketMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        powerSocketMat.specularColor = new BABYLON.Color3(0.001, 0.001, 0.001);
        powerSocketMat.specularIntensity = 0;

        var powerSocketPinsMat = new BABYLON.StandardMaterial("pins", scene);
        powerSocketPinsMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        powerSocketPinsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        powerSocketPinsMat.specularIntensity = 0.1;

        var powerSocketScrewsMat = new BABYLON.PBRMaterial("screws", scene);
        powerSocketScrewsMat.reflectionTexture = hdrTexture;
        powerSocketScrewsMat.reflectionColor = new BABYLON.Color3(0.01, 0.01, 0.01);
        powerSocketScrewsMat.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);
        powerSocketScrewsMat.roughness = 0.2;
        powerSocketScrewsMat.metallic = 0.5;
        powerSocketScrewsMat.specularIntensity = 0.4;
        powerSocketScrewsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var powerSocketMultiMat = new BABYLON.MultiMaterial("multi", scene);
        powerSocketMultiMat.subMaterials.push(powerSocketMat);
        powerSocketMultiMat.subMaterials.push(powerSocketPinsMat);
        powerSocketMultiMat.subMaterials.push(powerSocketScrewsMat);

        // Cable
        var cableMat = new BABYLON.StandardMaterial("cable", scene);
        cableMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        cableMat.specularColor = new BABYLON.Color3(0.001, 0.001, 0.001);
        cableMat.specularIntensity = 0;

        var cableBlackMat = new BABYLON.StandardMaterial("cable", scene);
        cableBlackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        cableBlackMat.specularColor = new BABYLON.Color3(0, 0, 0);
        cableBlackMat.specularIntensity = 0;

        var cableMultiMat = new BABYLON.MultiMaterial("multi", scene);
        cableMultiMat.subMaterials.push(cableMat);
        cableMultiMat.subMaterials.push(cableBlackMat);

        var backPanel = new IntereactiveView.Product.CreateNewElement("back_panel");
        backPanel.material = panelMat;

        var interactiveElements = IntereactiveView.Product.CreateNewElements(["power_socket", "fx_loop_return", "fx_loop_send", "fs", "line_mp3_in", "emulated_out", "loudspeakers_1x8_a", "loudspeakers_1x8b",
            "loudspeakers_1x16", "cable"]);

        interactiveElements[0].material = powerSocketMultiMat;      // Power Socket
        interactiveElements[1].material = fxLoopMultiMat;           // FX Loop Return
        interactiveElements[2].material = fxLoopMultiMat;           // FX Loop Send
        interactiveElements[3].material = fsMultiMat;               // FS
        interactiveElements[4].material = emulatedOutMultiMat;      // Line MP3 In
        interactiveElements[5].material = emulatedOutMultiMat;      // Emulated Out
        interactiveElements[6].material = loudspeakerMultiMat;      // Loudspeakers 1x8
        interactiveElements[7].material = loudspeakerMultiMat;      // Loudspeakers 1x8
        interactiveElements[8].material = loudspeakerMultiMat;      // Loudspeakers 1x16
        interactiveElements[9].material = cableMultiMat;            // Cable

        for (i = 0; i < interactiveElements.length; i++) {
            var element = interactiveElements[i];
            element.isInteractable = true;
        }

        IntereactiveView.Product.PushNewInteractiveElements(product, interactiveElements);

        product.elements.push(backPanel);
    }

    function CreateCorners(scene, product) {
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("resources/reflectionmap.dds", scene);

        var plasticMat = new BABYLON.PBRMaterial("plastic", scene);
        plasticMat.reflectionTexture = hdrTexture;
        plasticMat.microSurface = 0.96;
        plasticMat.albedoColor = new BABYLON.Color3(0.001, 0.001, 0.001);
        plasticMat.reflectivityColor = new BABYLON.Color3(0.003, 0.003, 0.003);
        plasticMat.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        plasticMat.specularIntensity = 100;

        var screwsMat = new BABYLON.PBRMaterial("screws", scene);
        screwsMat.reflectionTexture = hdrTexture;
        screwsMat.reflectionColor = new BABYLON.Color3(0.629, 0.45851, 0.2628);
        screwsMat.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.75);
        screwsMat.specularColor = new BABYLON.Color3(0.95, 0.95, 0.75);
        screwsMat.specularIntensity = 0.1;
        screwsMat.roughness = 0.3;
        screwsMat.metallic = 1.1;

        var multiMaterial = new BABYLON.MultiMaterial("multi", scene);
        multiMaterial.subMaterials.push(plasticMat);
        multiMaterial.subMaterials.push(screwsMat);

        var corners = new IntereactiveView.Product.CreateNewElement("corners");
        corners.material = multiMaterial;

        product.elements.push(corners);
    }

    function CreateHandle(scene, product) {
        var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("resources/reflectionmap.dds", scene);

        var handleMat = new BABYLON.StandardMaterial("handle", scene);
        handleMat.diffuseColor = new BABYLON.Color3(0.03, 0.03, 0.03);
        handleMat.specularColor = new BABYLON.Color3(0.025, 0.025, 0.025);
        handleMat.specularIntensity = 0.1;

        var screwsMat = new BABYLON.PBRMaterial("screws", scene);
        screwsMat.reflectionTexture = hdrTexture;
        screwsMat.reflectionColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        screwsMat.albedoColor = new BABYLON.Color3(0.05, 0.05, 0.05);
        screwsMat.roughness = 0.5;
        screwsMat.metallic = 1.0;
        screwsMat.specularIntensity = 0.4;
        screwsMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

        var multiMaterial = new BABYLON.MultiMaterial("multi", scene);
        multiMaterial.subMaterials.push(handleMat);
        multiMaterial.subMaterials.push(screwsMat);

        var handle = new IntereactiveView.Product.CreateNewElement("handle");
        handle.material = multiMaterial;

        product.elements.push(handle);
    }

}(window.ClusterConfigurator = window.ClusterConfigurator || {}));