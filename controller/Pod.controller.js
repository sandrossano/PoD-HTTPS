sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/base/util/UriParameters",
    "./formatter",
    "sap/ui/model/FilterType",
    "sap/ui/model/Sorter",
    "sap/ui/core/format/DateFormat"
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    Filter,
    FilterOperator,
    UriParameters,
    formatter,
    FilterType,
    Sorter,
    DateFormat
  ) {
    "use strict";
    var pressDialog;
    var usr;
    return Controller.extend("Quickstart.controller.Pod", {
      pressDialog: null,
      formatter: formatter,
      onInit: function () {
        sap.ui.core.BusyIndicator.show();
        var logged = sessionStorage.getItem("Logged");
        usr = sessionStorage.getItem("User");

        var sParam = UriParameters.fromQuery(window.location.search).get("US");
        var sParam2 = UriParameters.fromQuery(window.location.search).get("TK");
        var d = new Date();
        var passhash = CryptoJS.MD5(d.getHours() + d.getMinutes() + "").toString();

        if (passhash === sParam2) {
          usr = sParam;
          logged = "X";
          sessionStorage.setItem("Logged", logged);
          sessionStorage.setItem("User", usr);
        } else {
          logged = "";
        }

        if (logged !== "X") {
          window.open("index.html", "_self");
        }

        /*	var oViewModel = new JSONModel({
					"Data": [{
						"Consegna": "5001188960",
						"NumeroDDT": "1402000006",
						"DataConsegna": "20.10.2020",
						"NomeComm": "BARILLA G. E R. FRATELLI S.P.A.",
						"CittaComm": "PARMA",
						"CapComm": "43100",
						"RegioComm": "PR",
						"ViaComm": "VIA MANTOVA, 166",
						"NomeDest": "BARILLA G. E R. FRATELLI S.P.A.",
						"CittaDest": "PARMA",
						"CapDest": "43100",
						"RegioDest": "PR",
						"ViaDest": "VIA MANTOVA, 166"
					}]
				});
				this.getView().setModel(oViewModel, "DDT");*/

        var apigClient = apigClientFactory.newClient({
          apiKey: "zJjDPc92wx5XovVCpTEkY8QozlzcJAIz6Yl0G4ik"
        });
        var that = this;
        var path = "?$filter=Usrid%20eq%20%27" + usr.toUpperCase() + "%27";
        var params = {
          Authorization: "Basic c3NpaTpsaW1waW8=",
          //Origin: 'https://2eux8z72w3.execute-api.eu-west-3.amazonaws.com',
          path: path //'(Pwdob=\'POD\',Uname=\'SSII\',Pwd=\'DQ3PCyo37B\')',
        };
        apigClient
          .ZWEBPODSRVList(params)
          .then(function (result) {
            var oViewModel = new JSONModel(result.data.d);

            that.getView().setModel(oViewModel, "DDT");
            sap.ui.core.BusyIndicator.hide();
          })
          .catch(function (result) {
            // Add error callback code here.
            MessageToast.show(
              result.data.error.innererror.errordetails[1].message,
              {
                duration: 4000, // default
                width: "20em", // default
                my: "center bottom", // default
                at: "center bottom", // default
                of: window, // default
                offset: "0 -30", // default
                collision: "fit fit", // default
                onClose: null, // default
                autoClose: true, // default
                animationTimingFunction: "ease", // default
                animationDuration: 1000, // default
                closeOnBrowserNavigation: true // default
              }
            );
            console.log(
              "Code: ",
              result.data.error.innererror.errordetails[1].code
            );
            console.log(
              "Message: ",
              result.data.error.innererror.errordetails[1].message
            );
          });

        var oViewModel = new JSONModel({
          order: 0,
          orderHide: "",
          orderDDT: 0
        });
        this.getView().setModel(oViewModel, "appView");
      },
      onAfterRendering: function () {
        this.getView().byId("userHeader").setText(usr);
      },
      onLogout: function () {
        sessionStorage.clear();
         window.open("https://portal.awskeytech.com", "_self");
      },
      onClearFilter: function (oEvent) {
        // build filter array
        var aFilter = [];
        //var sQuery = oEvent.getParameter("query");

        this.getView().byId("DDTFilter").setValue("");
        this.getView().byId("DataFilter").setValue("");
        this.getView().byId("TargaFilter").setValue("");
        this.getView().byId("DestFilter").setValue("");

        aFilter.push(
          new Filter({
            filters: [
              new Filter("NumeroDDT", FilterOperator.Contains, ""),
              //new Filter("Consegna", FilterOperator.Contains, sQuery),
              new Filter("NomeDest", FilterOperator.Contains, ""),
              new Filter("Targa", FilterOperator.Contains, ""),
              new Filter("DataConsegna", FilterOperator.Contains, "")
            ],
            and: true
          })
        );

        // filter binding
        var oList = this.getView().byId("DDTList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
        var oPanel = this.byId("FilterPanel");
        oPanel.setExpanded(false);
      },
      onFilterInvoices: function (oEvent) {
        // build filter array
        var aFilter = [];
        //var sQuery = oEvent.getParameter("query");

        var sQuery = this.getView().byId("DDTFilter").getValue();
        sQuery.replace(/\s+/g, "");
        var sQueryData = this.getView().byId("DataFilter").getValue();
        sQueryData.replace(/\s+/g, "");
        var sQueryTarga = this.getView().byId("TargaFilter").getValue();
        sQueryTarga.replace(/\s+/g, "");
        sQueryTarga.toUpperCase();
        var sQueryDest = this.getView().byId("DestFilter").getValue();
        sQueryDest.replace(/\s+/g, "");
        if (
          sQuery !== "" ||
          sQueryData !== "" ||
          sQueryTarga !== "" ||
          sQueryDest !== ""
        ) {
          aFilter.push(
            new Filter({
              filters: [
                new Filter("NumeroDDT", FilterOperator.Contains, sQuery),
                //new Filter("Consegna", FilterOperator.Contains, sQuery),
                new Filter("NomeDest", FilterOperator.Contains, sQueryDest),
                new Filter("Targa", FilterOperator.Contains, sQueryTarga),
                new Filter("DataConsegna", FilterOperator.Contains, sQueryData)
              ],
              and: true
            })
          );
        }

        // filter binding
        var oList = this.getView().byId("DDTList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
        var oPanel = this.byId("FilterPanel");
        oPanel.setExpanded(false);
      },
      onSort: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"], //undefined,
          aStateTextIds = ["sortAscending", "sortDescending"], //"sortNone",
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/order");

        var dateformat = DateFormat.getDateTimeInstance({
          pattern: "dd.MM.YYYY"
        });
        // Cycle between the states
        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        var oSorter = new Sorter("DataConsegna", sOrder === "desc");
        oSorter.fnCompare = function (value1, value2) {
          var date2 = dateformat.parse(value2);
          var date1 = dateformat.parse(value1);
          value1 = date1.getTime();
          value2 = date2.getTime();

          if (value1 < value2) return -1;
          if (value1 == value2) return 0;
          if (value1 > value2) return 1;
        };
        oView.byId("DDTList").getBinding("items").aSorters.push(oSorter);

        oView.getModel("appView").setProperty("/order", iOrder);
        oView
          .byId("DDTList")
          .getBinding("items")
          .sort(sOrder && oSorter);

        /*			sMessage = this._getText("sortMessage", [
							this._getText(aStateTextIds[iOrder])
						]);
						MessageToast.show(sMessage);*/
      },
      onSortDDT: function () {
        var oView = this.getView(),
          aStates = ["asc", "desc"], //undefined,
          aStateTextIds = ["sortAscending", "sortDescending"], //"sortNone",
          sMessage,
          iOrder = oView.getModel("appView").getProperty("/orderDDT");

        // Cycle between the states
        iOrder = (iOrder + 1) % aStates.length;
        var sOrder = aStates[iOrder];

        oView.getModel("appView").setProperty("/orderDDT", iOrder);
        oView
          .byId("DDTList")
          .getBinding("items")
          .sort(sOrder && new Sorter("NumeroDDT", sOrder === "desc"));

        /*			sMessage = this._getText("sortMessage", [
							this._getText(aStateTextIds[iOrder])
						]);
						MessageToast.show(sMessage);*/
      },
      onHideElab: function () {
        var sel = this.getView().getModel("appView").getProperty("/orderHide");
        var value = "";
        if (sel === "sap-icon://accept") {
          value = "";
        } else {
          value = "sap-icon://accept";
        }
        var oView = this.getView(),
          oFilter = new Filter({
            filters: [
              new Filter({
                path: "Check_ZPOD",
                operator: FilterOperator.EQ,
                value1: value
              })
              /*,
						new Filter({
						  path: "UserName",
						  operator: FilterOperator.Contains,
						  value1: sValue
						})*/
            ],
            and: false
          });
        this.getView().getModel("appView").setProperty("/orderHide", value);
        oView
          .byId("DDTList")
          .getBinding("items")
          .filter(oFilter, FilterType.Application);
      },
      onPressItem: function (oEvent) {
        sap.ui.core.BusyIndicator.show();
        var oItem = oEvent.getSource();
        //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var itemclickednum = oItem.getBindingContext("DDT").getPath().substr(9);
        var itemclicked = oItem.getBindingContext("DDT").getModel().getData();
        var data = itemclicked.results[itemclickednum];
        MessageToast.show(data.NumeroDDT);

        sessionStorage.setItem("NumeroDDT", data.NumeroDDT);
        sessionStorage.setItem("Consegna", data.Consegna);
        sessionStorage.setItem("DataConsegna", data.DataConsegna);
        sessionStorage.setItem("Targa", data.Targa);
        sessionStorage.setItem("NomeComm", data.NomeComm);
        sessionStorage.setItem("NomeDest", data.NomeDest);
        sessionStorage.setItem("CittaComm", data.CittaComm);
        sessionStorage.setItem("CittaDest", data.CittaDest);
        sessionStorage.setItem("CapComm", data.CapComm);
        sessionStorage.setItem("RegioComm", data.RegioComm);
        sessionStorage.setItem("ViaComm", data.ViaComm);
        sessionStorage.setItem("CapDest", data.CapDest);
        sessionStorage.setItem("RegioDest", data.RegioDest);
        sessionStorage.setItem("ViaDest", data.ViaDest);

        window.open("detailpod.html", "_self");

        //this.getView().destroyDependents();
        //var pressItem;
        //pressItem = sap.ui.xmlfragment("Quickstart.view.Detail", this);
        //this.getView().addDependent(pressItem);
        //pressDialog.setModel(this.getView().getModel());
        //sap.ui.getCore().byId("compl").setText(complex);
        //pressItem.open();
        //oRouter.navTo("detail", {
        //	invoicePath: itemclicked
        //});
      }
    });
  }
);
