sap.ui.define([], function() {
    "use strict";
    return {
        status: function(Status) {
            if (Status === "X") {
                return "sap-icon://accept";
            }
            else {
                return "sap-icon://decline";
            }
        }
    };
});
