var IntereactiveView = IntereactiveView || {};
IntereactiveView.Product = IntereactiveView.Product || {};

$(function (ns)
{
    const RENDER_OUTLINE_WIDTH = 0.1;

    $(function ()
    {

    });

    IntereactiveView.Product.CreateNewProduct = function (fileName)
    {
        this.fileName = fileName;
        this.elements = [];
        this.interactiveElements = [];
    }

    IntereactiveView.Product.PushNewElements = function (product, newElements)
    {
        for (i = 0; i < product.newElements.length; i++)
        {
            product.elements.push (newElements[i]);
        }
    };

    IntereactiveView.Product.PushNewInteractiveElements = function (product, newElements)
    {
        for (i = 0; i < newElements.length; i++)
        {
            product.interactiveElements.push (newElements[i]);
        }
    };

    IntereactiveView.Product.IsMeshLoaded = function (product)
    {
        for (i = 0; i < product.elements.length; i++)
        {
            if (!product.elements[i].isMeshLoaded)
            {
                return false;
            }
        }

        for (i = 0; i < product.interactiveElements.length; i++)
        {
            if (!product.interactiveElements[i].isMeshLoaded)
            {
                return false;
            }
        }

        return true;
    };

    IntereactiveView.Product.CreateNewElements = function (meshNames)
    {
        var elements = [];

        for (i = 0; i < meshNames.length; i++)
        {
            var newElement = new IntereactiveView.Product.CreateNewElement(meshNames[i]);
            elements.push(newElement);
        }

        return elements;
    }

    IntereactiveView.Product.CreateNewElement = function (meshName)
    {
        this.meshName = meshName;
        this.isMeshLoaded = false;
        this.checkCollisions = false;
    }


    IntereactiveView.Product.LoadMeshForProductElement = function (productElement, fileName, scene, onDoneCallback)
    {
       

        BABYLON.SceneLoader.ImportMesh(productElement.meshName, "resources/", fileName, scene, function (newMeshes)
        {
            var mesh = newMeshes[0];
           

            if (productElement.material == null)
            {
                var materialName = productElement.meshName + "Material";
                productElement.material = new BABYLON.StandardMaterial(materialName, scene);
            }

            mesh.material = productElement.material;

            if (productElement.isInteractable)
            {
                mesh.isPickable = true;
                mesh.actionManager = new BABYLON.ActionManager(scene);

                mesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (unitMesh)
                    {
                        if (unitMesh.meshUnderPointer !== null)
                        {
                            unitMesh.meshUnderPointer.renderOutline = true;
                            unitMesh.meshUnderPointer.outlineWidth = RENDER_OUTLINE_WIDTH;
                        }
                    })
                );

                mesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (unitMesh)
                    {
                        if (unitMesh.source !== null)
                        {
                            unitMesh.source.renderOutline = false;
                        }
                    })
                );
            }

            mesh.checkCollisions = productElement.checkCollisions;


            productElement.mesh = mesh;
            productElement.isMeshLoaded = true;

            if (onDoneCallback != null)
            {
                onDoneCallback(productElement);
            }
        });
    }
   
}(window.IntereactiveView = window.IntereactiveView || {}));