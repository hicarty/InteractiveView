var IntereactiveView = IntereactiveView || {};
IntereactiveView.SiteHex = IntereactiveView.SiteHex || {};

$(function (ns) {

    var engine;
    var scene;
    var camera;
    var canvas;
    var highlightLayer;
    var panel;

    var tiles = [];
    var hoveredTile = null;
    var focusedTile = null;
    var highlightedMeshes = [];

    var overview;
    var cameraTween = null;
    var isFocusMode = false;
    var focusAlpha;
    var focusBeta;

    var CUBE_SIZE = 1;
    var HALF = CUBE_SIZE / 2;
    var HEX_SPACING = 0.8;              // Neighbouring cubes sit HEX_SPACING * sqrt(3) apart
    var FILLER_DROP = 0.4;
    var HOVER_LIFT = 0.35;
    var BOB_HEIGHT = 0.04;

    var OVERVIEW_BETA = 0.95;
    var FOCUS_BETA = 0.75;
    var FOCUS_RADIUS = 3;
    var FOCUS_EXIT_RADIUS = 4.5;
    var CAMERA_ANIMATION_MS = 900;

    var BACKGROUND = new BABYLON.Color4(0.10196, 0.10196, 0.18039, 1.0);
    var SITE_COLOR = "#2ecc71";
    var FILLER_COLOR = "#2a2a44";
    var HOVER_COLOR = new BABYLON.Color3(0.6, 1.0, 0.75);
    var FOCUS_COLOR = BABYLON.Color3.White();

    // Axial neighbour offsets of a pointy-top hex grid, in ring walking order
    var HEX_DIRECTIONS = [
        { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
        { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
    ];

    IntereactiveView.SiteHex.Setup = function (renderCanvas, infoPanel, siteList, sitesUrl) {

        canvas = renderCanvas;
        panel = $(infoPanel);

        // Stencil is required by the highlight layer
        engine = new BABYLON.Engine(canvas, true, { stencil: true });
        engine.enableOfflineSupport = false;

        $.getJSON(sitesUrl, function (sites) {

            scene = createScene(sites);
            createSiteList(siteList, sites);

            engine.runRenderLoop(function () {
                scene.render();
            });
        }).fail(function () {
            console.error("Could not load the site index from " + sitesUrl);
        });

        window.addEventListener("resize", function () {
            engine.resize();
            updateFovMode();
        });

        panel.find(".site-hex-close").on("click", function () {
            unfocus();
        });

        $(document).on("keydown", function (e) {
            if (e.key === "Escape") {
                unfocus();
            }
        });
    }

    var createScene = function (sites) {

        scene = new BABYLON.Scene(engine);
        scene.clearColor = BACKGROUND;

        var rings = getRingCount(sites.length);
        var cells = createHexCells(rings);

        setupCamera(rings);
        setupLights();

        highlightLayer = new BABYLON.HighlightLayer("highlight", scene);

        // Cells beyond the number of sites become filler so the outline stays a full hexagon
        for (var i = 0; i < cells.length; i++) {
            tiles.push(createTile(cells[i], i < sites.length ? sites[i] : null, i));
        }

        scene.registerBeforeRender(function () {
            animateTiles();
            updateCameraTween();
        });

        scene.onPointerObservable.add(onPointerTap, BABYLON.PointerEventTypes.POINTERTAP);

        return scene;
    };

    function setupCamera(rings) {

        overview = {
            target: BABYLON.Vector3.Zero(),
            radius: 3.5 + rings * 2.5,
            beta: OVERVIEW_BETA
        };

        camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, overview.beta, overview.radius, overview.target.clone(), scene);

        camera.lowerRadiusLimit = FOCUS_RADIUS;
        camera.upperRadiusLimit = overview.radius * 1.5;
        camera.lowerBetaLimit = 0.2;
        camera.upperBetaLimit = 1.3;                    // Never look up from underneath the hex
        camera.wheelDeltaPercentage = 0.01;
        camera.pinchPrecision = 20;                     // Make zoom slower on mobile devices, default value is 2
        camera.panningSensibility = 0;

        camera.minZ = 0.1;
        camera.maxZ = 100;

        camera.attachControl(canvas, false);
        updateFovMode();

        camera.onViewMatrixChangedObservable.add(function () {

            // Mirrors the amplifier view: zooming or orbiting away from a focused cube means the
            // user is no longer interested in it, so return to the overview
            if (isFocusMode
                && (camera.radius > FOCUS_EXIT_RADIUS
                    || Math.abs(camera.alpha - focusAlpha) > 1
                    || Math.abs(camera.beta - focusBeta) > 0.6)) {
                unfocus();
            }
        });
    }

    function updateFovMode() {

        // Keep the whole hex in view on portrait screens by fixing the horizontal field of view instead
        camera.fovMode = engine.getAspectRatio(camera) < 1
            ? BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED
            : BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
    }

    function setupLights() {

        var hemisphericLight = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = 0.7;
        hemisphericLight.groundColor = new BABYLON.Color3(0.2, 0.2, 0.3);

        // Intensities are kept below a sum of 1 so the greens don't clip to cyan
        var directionalLight = new BABYLON.DirectionalLight("directionalLight", new BABYLON.Vector3(-0.5, -1, 0.8), scene);
        directionalLight.intensity = 0.3;
    }

    function getRingCount(cellCount) {

        var rings = 0;

        while (1 + 3 * rings * (rings + 1) < cellCount) {
            rings++;
        }

        return rings;
    }

    // Lists the cells of a hexagon with the given number of rings, spiralling out from the centre
    function createHexCells(rings) {

        var cells = [{ q: 0, r: 0 }];

        for (var ring = 1; ring <= rings; ring++) {

            var q = HEX_DIRECTIONS[4].q * ring;
            var r = HEX_DIRECTIONS[4].r * ring;

            for (var side = 0; side < HEX_DIRECTIONS.length; side++) {
                for (var step = 0; step < ring; step++) {
                    cells.push({ q: q, r: r });
                    q += HEX_DIRECTIONS[side].q;
                    r += HEX_DIRECTIONS[side].r;
                }
            }
        }

        return cells;
    }

    function createTile(cell, site, index) {

        var cube = BABYLON.MeshBuilder.CreateBox((site ? "site" : "filler") + index, { size: CUBE_SIZE }, scene);
        cube.position = new BABYLON.Vector3(HEX_SPACING * Math.sqrt(3) * (cell.q + cell.r / 2), 0, HEX_SPACING * 1.5 * cell.r);

        var material = new BABYLON.StandardMaterial(cube.name + "Material", scene);
        material.diffuseColor = BABYLON.Color3.FromHexString(site ? site.color || SITE_COLOR : FILLER_COLOR);
        material.specularColor = BABYLON.Color3.Black();
        cube.material = material;

        cube.enableEdgesRendering();
        cube.edgesWidth = 2.0;
        cube.edgesColor = new BABYLON.Color4(0, 0, 0, 0.2);

        var tile = {
            cube: cube,
            site: site,
            baseY: site ? 0 : -FILLER_DROP,
            lift: 0,
            phase: index * 0.9
        };

        if (site) {
            createLabel(tile);
            registerHover(tile);
        }
        else {
            cube.isPickable = false;
        }

        cube.position.y = tile.baseY;

        return tile;
    }

    function createLabel(tile) {

        var size = 256;
        var texture = new BABYLON.DynamicTexture(tile.cube.name + "Label", { width: size, height: size }, scene, true);
        texture.hasAlpha = true;

        // Shrink the font until the label fits across the top face
        var context = texture.getContext();
        var fontSize = 64;

        do {
            context.font = "bold " + fontSize + "px Lato, Calibri, sans-serif";
            fontSize -= 4;
        } while (context.measureText(tile.site.label).width > size * 0.85 && fontSize > 16);

        context.clearRect(0, 0, size, size);
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "#ffffff";
        context.fillText(tile.site.label, size / 2, size / 2);
        texture.update();

        var material = new BABYLON.StandardMaterial(tile.cube.name + "LabelMaterial", scene);
        material.diffuseTexture = texture;
        material.useAlphaFromDiffuseTexture = true;
        material.emissiveColor = BABYLON.Color3.White();
        material.specularColor = BABYLON.Color3.Black();
        material.disableLighting = true;

        var label = BABYLON.MeshBuilder.CreatePlane(tile.cube.name + "Label", { size: CUBE_SIZE }, scene);
        label.parent = tile.cube;
        label.position = new BABYLON.Vector3(0, HALF + 0.002, 0);
        label.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        label.material = material;
        label.isPickable = false;
    }

    function registerHover(tile) {

        // The action manager also gives the canvas a pointer cursor over the cube
        tile.cube.actionManager = new BABYLON.ActionManager(scene);

        tile.cube.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
                setHoveredTile(tile);
            })
        );

        tile.cube.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
                if (hoveredTile === tile) {
                    setHoveredTile(null);
                }
            })
        );
    }

    function createSiteList(siteList, sites) {

        var list = $(siteList);

        for (var i = 0; i < sites.length; i++) {

            var link = $("<a>").attr("href", sites[i].url).text(sites[i].name);

            (function (tile) {
                link.on("mouseenter focus", function () { setHoveredTile(tile); });
                link.on("mouseleave blur", function () { setHoveredTile(null); });
            })(tiles[i]);

            list.append($("<li>").append(link));
        }
    }

    function onPointerTap() {

        if (cameraTween !== null) {
            return;
        }

        var pick = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
            return mesh.isPickable;
        });

        var tile = pick.hit ? findTile(pick.pickedMesh) : null;

        if (tile !== null) {
            focus(tile);
        }
        else {
            unfocus();
        }
    }

    function findTile(mesh) {

        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].cube === mesh) {
                return tiles[i];
            }
        }

        return null;
    }

    function focus(tile) {

        if (tile === focusedTile) {
            return;
        }

        focusedTile = tile;
        isFocusMode = false;
        refreshHighlight();
        showPanel(tile.site);

        var target = tile.cube.position.clone();
        target.y = tile.baseY + HOVER_LIFT;

        animateCamera(target, FOCUS_RADIUS, FOCUS_BETA, function () {
            focusAlpha = camera.alpha;
            focusBeta = camera.beta;
            isFocusMode = true;
        });
    }

    function unfocus() {

        if (focusedTile === null || cameraTween !== null) {
            return;
        }

        isFocusMode = false;
        focusedTile = null;
        refreshHighlight();
        hidePanel();

        animateCamera(overview.target, overview.radius, overview.beta, null);
    }

    function animateCamera(target, radius, beta, onFinished) {

        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        camera.detachControl(canvas);

        // Tweened by hand rather than with a Babylon animation because setting an ArcRotateCamera's
        // target rebuilds alpha, beta and radius from its current position, which fights a radius animation
        cameraTween = {
            fromTarget: camera.target.clone(),
            toTarget: target.clone(),
            fromRadius: camera.radius,
            toRadius: radius,
            fromBeta: camera.beta,
            toBeta: beta,
            alpha: camera.alpha,
            elapsed: 0,
            ease: ease,
            onFinished: onFinished
        };
    }

    function updateCameraTween() {

        if (cameraTween === null) {
            return;
        }

        var tween = cameraTween;
        tween.elapsed += engine.getDeltaTime();

        var progress = Math.min(1, tween.elapsed / CAMERA_ANIMATION_MS);
        var amount = tween.ease.ease(progress);

        camera.target = BABYLON.Vector3.Lerp(tween.fromTarget, tween.toTarget, amount);
        camera.alpha = tween.alpha;
        camera.beta = tween.fromBeta + (tween.toBeta - tween.fromBeta) * amount;
        camera.radius = tween.fromRadius + (tween.toRadius - tween.fromRadius) * amount;

        if (progress === 1) {
            cameraTween = null;
            camera.attachControl(canvas, false);

            if (tween.onFinished !== null) {
                tween.onFinished();
            }
        }
    }

    function animateTiles() {

        var time = performance.now() / 1000;
        var blend = Math.min(1, engine.getDeltaTime() / 120);

        for (var i = 0; i < tiles.length; i++) {

            var tile = tiles[i];

            if (tile.site === null) {
                continue;
            }

            var targetLift = (tile === hoveredTile || tile === focusedTile) ? HOVER_LIFT : 0;
            tile.lift += (targetLift - tile.lift) * blend;

            tile.cube.position.y = tile.baseY + tile.lift + Math.sin(time * 1.5 + tile.phase) * BOB_HEIGHT;
        }
    }

    function setHoveredTile(tile) {

        hoveredTile = tile;
        refreshHighlight();
    }

    function refreshHighlight() {

        for (var i = 0; i < highlightedMeshes.length; i++) {
            highlightLayer.removeMesh(highlightedMeshes[i]);
        }

        highlightedMeshes = [];

        if (hoveredTile !== null && hoveredTile !== focusedTile) {
            highlightLayer.addMesh(hoveredTile.cube, HOVER_COLOR);
            highlightedMeshes.push(hoveredTile.cube);
        }

        if (focusedTile !== null) {
            highlightLayer.addMesh(focusedTile.cube, FOCUS_COLOR);
            highlightedMeshes.push(focusedTile.cube);
        }
    }

    function showPanel(site) {

        panel.find(".site-hex-title").text(site.name);
        panel.find(".site-hex-description").text(site.description);
        panel.find(".site-hex-visit").attr("href", site.url);
        panel.addClass("is-open").attr("aria-hidden", "false");
    }

    function hidePanel() {

        panel.removeClass("is-open").attr("aria-hidden", "true");
    }

}(window.IntereactiveView = window.IntereactiveView || {}));
