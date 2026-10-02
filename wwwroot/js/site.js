var IntereactiveView = IntereactiveView || {};
IntereactiveView.Site = IntereactiveView.Site || {};

$(function (ns) {
    var canvas = document.getElementById("RenderCanvas");

    // Pages without the product render canvas have no scene to build
    if (canvas === null) {
        return;
    }

    // Create Babylon 3D Engine
    var engine = new BABYLON.Engine(canvas, true);

    // SCENE
    var scene;

    var productDSL20C;

    $(function () {

        scene = createScene();

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () {
            scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });

        $('#RenderCanvas').bind("mousewheel", function () {
            return false;
        });
    });

    var createScene = function () {
        // SETTINGS
        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
        engine.enableOfflineSupport = false;

        // SCENE
        var scene = new BABYLON.Scene(engine);
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        scene.clearColor = BABYLON.Color3.White();
        scene.collisionsEnabled = true;

        // Ground
        /*var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
        var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        ground.material = groundMaterial;
        ground.receiveShadows = true;
        */
        IntereactiveView.Camera.Setup(scene, canvas);
        SetupLights(scene);

        productDSL20C = new IntereactiveView.Product.CreateNewProduct("dsl20c.babylon");
        IntereactiveView.Loader.LoadProduct(scene, productDSL20C);

        // Keep this code for future reference, it allows us to load babylon file with all the materials and texture references
        /*BABYLON.SceneLoader.Append("resources/", "dsl20c.babylon", scene, function (scene) {
            $(".render-canvas-loading").fadeOut();

            for(i=0; i<scene.meshes.length; i++)
            {
                scene.meshes[i].scaling = new BABYLON.Vector3(0.3,0.3,0.3)
            }
        
        });*/

        return scene;
    };

    function SetupLights(scene) {

        // HEMISPHERIC LIGHT
        var hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight1", new BABYLON.Vector3(0.0, 1, 0), scene);
        hemisphericLight.intensity = 2.0;

        // DIRECTIONAL LIGHT
        var directionalLight1 = new BABYLON.DirectionalLight("directionalLight1", new BABYLON.Vector3(0.0, -1.0, 0.0), scene);
        directionalLight1.intensity = 2.0;
    }

    IntereactiveView.Site.LoadElements = function(scene) {
        // Load non-interactive elements
        for (i = 0; i < productDSL20C.elements.length; i++) {
            var element = productDSL20C.elements[i];

            //element.checkCollisions = true;

            IntereactiveView.Product.LoadMeshForProductElement(element, productDSL20C.fileName, scene, function () {
                CheckLoadFinished(productDSL20C);
            });
        }

        // Load interactive elements
        for (i = 0; i < productDSL20C.interactiveElements.length; i++) {
            var element = productDSL20C.interactiveElements[i];

            IntereactiveView.Product.LoadMeshForProductElement(element, productDSL20C.fileName, scene, function (productElement) {
                productElement.mesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function (unitMesh) { //(trigger, function, condition)
                        if (unitMesh.source !== null) {
                            var sourceMesh = unitMesh.source;
                            IntereactiveView.Camera.FocusAt(sourceMesh);
                            IntereactiveView.Site.DisplayPartInformation(sourceMesh);
                        }
                    })
                );

                CheckLoadFinished(productDSL20C);
            });
        }
    }

    function CheckLoadFinished(object) {
        if (IntereactiveView.Product.IsMeshLoaded(object)) {
            $(".render-canvas-loading").fadeOut();
        }
    }

    function getJSONData(mesh) {
        var actionUrl = '/Home/Description/1/' + mesh.name; //gets the mesh name of what you clicked on
        $.ajax({
            type: 'GET',
            url: actionUrl,
            success: function (element) {
            var description = '';
                if (element != null) {
                    description = element.description;
                } else {
                    description = 'No Data!';
                }
                createDiv(description);
            },
            error: function () {
                alert("It didnt work");
            }
        });
    };

    function createDiv(text) {
        var Node = '<div class="diamond"><div class="arrow"></div></div>';
        div = $('#description-block');
        if (div.length > 0) {
            div[0].innerHTML = text + Node;
        } else {
            var newDiv = document.createElement('div');
            newDiv.id = 'description-block';
            newDiv.className = 'info-text';
            newDiv.innerHTML = text + Node;
            document.getElementsByClassName('render-canvas')[0].appendChild(newDiv);
        }
    }

    IntereactiveView.Site.DisplayPartInformation = function (mesh) {
        var description = getJSONData(mesh);
        console.log(mesh.name);
    }

    IntereactiveView.Site.RemovePartInformation = function () {
        var elements = document.getElementsByClassName('info-text');

        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

}(window.ClusterConfigurator = window.ClusterConfigurator || {}));