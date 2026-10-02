var IntereactiveView = IntereactiveView || {};
IntereactiveView.Camera = IntereactiveView.Camera || {};

$(function (ns) {

    var camera;
    var scene;
    var canvas;

    var cameraOriginalPosition;
    var cameraOriginalTarget;
    var cameraOriginalAlpha;
    var cameraOriginalBeta;

    var cameraPositionAnimFinished = false;
    var cameraTargetAnimFinished = false;
    var isElementCloseViewMode = false;

    $(function () {

    });

    IntereactiveView.Camera.Setup = function (scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;

        this.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 1, 0), scene);
        IntereactiveView.Camera.EnableInput(true);
        this.camera.checkCollisions = true;

        this.camera.setPosition(new BABYLON.Vector3(0, 0, -50));

        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 4;
        this.camera.upperBetaLimit = 1.75;
        this.camera.wheelDeltaPercentage = 0.01;
        this.camera.pinchPrecision = 20;                 // Make zoom slower on mobile devices, default value is 2

        // Set camera clipping
        this.camera.maxZ = 500;
        this.camera.minZ = 0;

        this.cameraOriginalPosition = this.camera.position;
        this.cameraOriginalTarget = this.camera.target;

        this.camera.onViewMatrixChangedObservable.add(function () {

            if (IntereactiveView.Camera.isElementCloseViewMode) {


                var camera = IntereactiveView.Camera.camera;

                // Checks if user is no longer interested in this element by ...
                if (camera.radius > 1.5                                                                 // Zooming out too far 
                    || camera.alpha > IntereactiveView.Camera.cameraOriginalAlpha + 1               // Moving too far to the right
                    || camera.alpha < IntereactiveView.Camera.cameraOriginalAlpha - 1               // Moving too far to the left
                    || camera.beta > IntereactiveView.Camera.cameraOriginalBeta + 1                 // Moving too far up
                    || camera.beta < IntereactiveView.Camera.cameraOriginalBeta - 1)                // Moving too far down
                {
                    IntereactiveView.Camera.isElementCloseViewMode = false;
                    IntereactiveView.Camera.EnableInput(false);
                    IntereactiveView.Site.RemovePartInformation();

                    IntereactiveView.Camera.AnimateCameraTo(IntereactiveView.Camera.cameraOriginalTarget, IntereactiveView.Camera.cameraOriginalPosition, 1, 3, function () {
                        //onFinished Animation
                        IntereactiveView.Camera.ResetCamera();
                        IntereactiveView.Camera.EnableInput(true);
                    });
                }
            }
        });
    }

    IntereactiveView.Camera.ResetCamera = function () {
        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 4;
        this.camera.upperBetaLimit = 1.75;
        this.camera.wheelDeltaPercentage = 0.01;
    }

    IntereactiveView.Camera.FocusAt = function(mesh) {

        var newTarget = mesh.position;

        var newPosition = new BABYLON.Vector3;
        newPosition.x = mesh.position.x;
        newPosition.y = mesh.position.y;
        newPosition.z = -0.6 * mesh.forward.z;

        IntereactiveView.Camera.EnableInput(false);

        // Allow bigger zoom
        this.camera.lowerRadiusLimit = 1;

        this.cameraOriginalPosition = this.camera.position;

        IntereactiveView.Camera.AnimateCameraTo(newTarget, newPosition, 3, 1, function () {

            IntereactiveView.Camera.cameraOriginalAlpha = IntereactiveView.Camera.camera.alpha;
            IntereactiveView.Camera.cameraOriginalBeta = IntereactiveView.Camera.camera.beta;
            IntereactiveView.Camera.isElementCloseViewMode = true;

            IntereactiveView.Camera.EnableInput(true);
        });
    }

    IntereactiveView.Camera.AnimateCameraTo = function (newTarget, newPosition, speed, duration, onFinished) {

        var ease = new BABYLON.CubicEase();
        ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        BABYLON.Animation.CreateAndStartAnimation('cameraAnimation1', this.camera, 'position', speed, duration, this.camera.position, newPosition, 0, ease, function () {

            cameraPositionAnimFinished = true;

            if (cameraTargetAnimFinished) {

                if (onFinished != null) {
                    onFinished();
                }
            }
        });

        BABYLON.Animation.CreateAndStartAnimation('cameraAnimation2', this.camera, 'target', speed, duration, this.camera.target, newTarget, 0, ease, function () {

            cameraTargetAnimFinished = true;

            if (cameraPositionAnimFinished) {

                if (onFinished != null) {
                    onFinished();
                }
            }
        });
    }

    IntereactiveView.Camera.EnableInput = function (enable) {

        if (enable) {
            this.camera.attachControl(this.canvas, false);
        }
        else {
            this.camera.detachControl(this.canvas);
        }
    }

    IntereactiveView.Camera.GetCamera = function () {
        return this.camera;
    }

}(window.IntereactiveView = window.IntereactiveView || {}));