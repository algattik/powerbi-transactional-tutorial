
window.webApiConfig = {
    clientId: CLIENT_ID,
    resourceId: "https://analysis.windows.net/powerbi/api",
    callback: callbackFunction,
    popUp: true
};





var authenticationContext = new AuthenticationContext(webApiConfig);

function signIn() {
    authenticationContext.login();
}


function callbackFunction(errorDesc, token, error, tokenType) {

    authenticationContext.acquireToken(webApiConfig.resourceId, function (errorDesc, token, error) {
        if (error) { //acquire token failure
            console.error(error, error_desc);
        }
        else {
            //acquired token successfully
            handleAuthenticated(token);
        }
    });
}


if (authenticationContext.isCallback(window.location.hash)) {
    authenticationContext.handleWindowCallback();
}

