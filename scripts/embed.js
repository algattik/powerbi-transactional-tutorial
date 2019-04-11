let EmbeddingState = {
    report: null,
    selectedCustomer: null,
    selectedProduct: null,
    waiting: false,
}

// Embed the report
function handleAuthenticated(accessToken) {
    $("#SignIn").hide();

    // Get models. models contains enums that can be used
    const models = window['powerbi-client'].models;

    // Use View permissions
    let permissions = models.Permissions.View;

    // Embed configuration used to describe the what and how to embed
    // This object is used when calling powerbi.embed
    // This also includes settings and options such as filters
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details
    let config = {
        type: 'report',
        tokenType: models.TokenType.Aad,
        accessToken: accessToken,
        embedUrl: EMBED_URL,
        permissions: permissions,
        settings: {
            filterPaneEnabled: false,
            navContentPaneEnabled: false,
        }
    };

    // Get a reference to the embedded report HTML element
    let embedContainer = $('#embedContainer')[0];

    // Embed the report and display it within the div container
    EmbeddingState.report = powerbi.embed(embedContainer, config);

    // Add event handlers to capture user interaction
    EmbeddingState.report.on("dataSelected", function (event) {
        var data = event.detail;
        data.dataPoints.forEach(function (dataPoint) {
            dataPoint.identity.forEach(function (p) {

                if (p.target.table == "SalesLT Customer" && p.target.column == "CustomerID") {
                    EmbeddingState.selectedCustomer = p.equals;
                }
                if (p.target.table == "SalesLT Customer" && p.target.column == "FirstName") {
                    $('#customerName').text(p.equals);
                }
                if (p.target.table == "SalesLT ProductCatalog" && p.target.column == "ProductID") {
                    EmbeddingState.selectedProduct = p.equals;
                }
                if (p.target.table == "SalesLT ProductCatalog" && p.target.column == "Name") {
                    $('#productName').text(p.equals);
                }
            });
        });

        updateButtonState();
    });
}


// Create a sales order
function createSalesOrder() {
    $("#CreateSalesOrder").prop("disabled", true);
    let payload = {
        'CustomerID': EmbeddingState.selectedCustomer,
        'ProductID': EmbeddingState.selectedProduct,
    };
    $.ajax({
        url: LOGIC_APP_ENDPOINT, data: JSON.stringify(payload), contentType: "application/json", method: "POST", success: function (result) {
            EmbeddingState.report.refresh();
            EmbeddingState.waiting = true;
            sleep(15000).then(() => {
                EmbeddingState.waiting = false;
                updateButtonState();
            });

        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateButtonState() {
    if (EmbeddingState.selectedProduct && EmbeddingState.selectedCustomer && !EmbeddingState.waiting) {
        $("#CreateSalesOrder").prop("disabled", false);
    }
}

