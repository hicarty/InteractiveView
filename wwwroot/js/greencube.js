var IntereactiveView = IntereactiveView || {};
IntereactiveView.GreenCube = IntereactiveView.GreenCube || {};

$(function (ns) {

    var cube;
    var engine;
    var scene;

    var CUBE_SIZE = 2;
    var HALF = CUBE_SIZE / 2;
    var SPIN_DURATION_MS = 6000;
    var SPIN_FRAMES_PER_SECOND = 60;
    var CAMERA_DISTANCE = 6;

    var BACKGROUND = new BABYLON.Color4(0.10196, 0.10196, 0.18039, 1.0);

    var FACES = [
        { name: "front", color: "#2ecc71", position: new BABYLON.Vector3(0, 0, HALF), rotation: new BABYLON.Vector3(0, 0, 0) },
        { name: "back", color: "#27ae60", position: new BABYLON.Vector3(0, 0, -HALF), rotation: new BABYLON.Vector3(0, Math.PI, 0) },
        { name: "right", color: "#3de07e", position: new BABYLON.Vector3(HALF, 0, 0), rotation: new BABYLON.Vector3(0, Math.PI / 2, 0) },
        { name: "left", color: "#1fad5a", position: new BABYLON.Vector3(-HALF, 0, 0), rotation: new BABYLON.Vector3(0, -Math.PI / 2, 0) },
        { name: "top", color: "#4ef094", position: new BABYLON.Vector3(0, HALF, 0), rotation: new BABYLON.Vector3(Math.PI / 2, 0, 0) },
        { name: "bottom", color: "#239b55", position: new BABYLON.Vector3(0, -HALF, 0), rotation: new BABYLON.Vector3(-Math.PI / 2, 0, 0) }
    ];

    IntereactiveView.GreenCube.Setup = function (renderCanvas) {

        engine = new BABYLON.Engine(renderCanvas, true);
        engine.enableOfflineSupport = false;

        scene = createScene();

        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    }

    var createScene = function () {

        scene = new BABYLON.Scene(engine);
        scene.clearColor = BACKGROUND;

        setupCamera();

        cube = createCube();
        spinCube();

        return scene;
    };

    function setupCamera() {

        var camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 0, -CAMERA_DISTANCE), scene);

        camera.setTarget(BABYLON.Vector3.Zero());
        camera.fov = 2 * Math.atan(HALF / CAMERA_DISTANCE);
        camera.minZ = 0.1;
        camera.maxZ = 100;

        camera.detachControl();
    }

    function createCube() {

        var root = new BABYLON.TransformNode("cube", scene);

        for (var i = 0; i < FACES.length; i++) {
            createFace(FACES[i], root);
        }

        return root;
    }

    function createFace(face, parent) {

        var material = new BABYLON.StandardMaterial(face.name + "Material", scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(face.color);
        material.emissiveColor = BABYLON.Color3.FromHexString(face.color);
        material.specularColor = BABYLON.Color3.Black();

        // The source cube is flat CSS colour per face with no shading, so lighting is
        // disabled and the face colour is carried by emissive. With lighting enabled the
        // green and blue channels clip to 1.0 and the faces read as cyan instead.
        material.disableLighting = true;
        material.alpha = 0.9;

        var mesh = BABYLON.MeshBuilder.CreatePlane(face.name, { size: CUBE_SIZE, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
        mesh.parent = parent;
        mesh.position = face.position.clone();
        mesh.rotation = face.rotation.clone();
        mesh.material = material;

        mesh.enableEdgesRendering();
        mesh.edgesWidth = 2.0;
        mesh.edgesColor = new BABYLON.Color4(0, 0, 0, 0.2);

        return mesh;
    }

    function spinCube() {

        // No easing function means the default linear interpolation, matching "linear" in the CSS keyframes
        var endFrame = SPIN_DURATION_MS * SPIN_FRAMES_PER_SECOND / 1000;
        var loopMode = BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE;

        BABYLON.Animation.CreateAndStartAnimation("spinX", cube, "rotation.x", SPIN_FRAMES_PER_SECOND, endFrame,
            0, 2 * Math.PI, loopMode);

        BABYLON.Animation.CreateAndStartAnimation("spinY", cube, "rotation.y", SPIN_FRAMES_PER_SECOND, endFrame,
            0, 2 * Math.PI, loopMode);
    }

}(window.IntereactiveView = window.IntereactiveView || {}));