sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ],
  function (
    Controller,
    JSONModel,
    MessageToast,
    Filter,
    FilterOperator,
    MessageBox
  ) {
    "use strict";
    var pressDialog;
    var usr;
    var NumeroDDT;
    var Consegna;
    var DataConsegna;
    var NomeComm;
    var NomeDest;
    var CittaComm;
    var CittaDest;
    var CapComm;
    var RegioComm;
    var ViaComm;
    var CapDest;
    var RegioDest;
    var ViaDest;
    var dataPress;
    var itemclickednum;

    return Controller.extend("Quickstart.controller.Detail", {
      pressDialog: null,
      onInit: function () {
        sap.ui.core.BusyIndicator.show();
        var logged = sessionStorage.getItem("Logged");
        usr = sessionStorage.getItem("User");
        if (logged !== "X") {
          window.open("index.html", "_self");
        }

        NumeroDDT = sessionStorage.getItem("NumeroDDT");
        Consegna = sessionStorage.getItem("Consegna");
        DataConsegna = sessionStorage.getItem("DataConsegna");
        NomeComm = sessionStorage.getItem("NomeComm");
        NomeDest = sessionStorage.getItem("NomeDest");
        CittaComm = sessionStorage.getItem("CittaComm");
        CittaDest = sessionStorage.getItem("CittaDest");
        CapComm = sessionStorage.getItem("CapComm");
        RegioComm = sessionStorage.getItem("RegioComm");
        ViaComm = sessionStorage.getItem("ViaComm");
        CapDest = sessionStorage.getItem("CapDest");
        RegioDest = sessionStorage.getItem("RegioDest");
        ViaDest = sessionStorage.getItem("ViaDest");

        if ((logged === "X" && Consegna === "") || Consegna == undefined) {
          window.open("pod.html", "_self");
        }
        var oViewModel = new JSONModel({
          Values: [
            { NotaVal: " " },
            { NotaVal: "Differenza Peso" },
            { NotaVal: "Prodotto non conforme" }
          ]
        });
        this.getView().setModel(oViewModel, "Note");

        /*var oViewModel = new JSONModel({
                "Data": [{
                        "Consegna": "5001188960",
                        "Posizione": "000010",
                        "UM": "TO",
                        "Materiale": "GRANO DURO",
                        "PesoNetto": "1.800",
                        "QtaConsegna": "2.000"
                    },
                    {
                        "Consegna": "5001188960",
                        "Posizione": "000020",
                        "UM": "TO",
                        "Materiale": "GRANO TENERO",
                        "PesoNetto": "",
                        "QtaConsegna": "3.000"
                    }
                ]
            });
            this.getView().setModel(oViewModel, "DDTPos");*/

        var apigClient = apigClientFactory.newClient({
          apiKey: "zJjDPc92wx5XovVCpTEkY8QozlzcJAIz6Yl0G4ik"
        });
        var that = this;
        var path = "?$filter=Consegna%20eq%20%27" + Consegna + "%27";
        var params = {
          Authorization: "Basic c3NpaTpsaW1waW8=",
          //Origin: 'https://2eux8z72w3.execute-api.eu-west-3.amazonaws.com',
          path: path //'(Pwdob=\'POD\',Uname=\'SSII\',Pwd=\'DQ3PCyo37B\')',
        };
        apigClient
          .ZWEBPODSRVPos(params)
          .then(function (result) {
            var oViewModel = new JSONModel(result.data.d);

            that.getView().setModel(oViewModel, "DDTPos");
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
      },

      onAfterRendering: function () {
        this.getView().byId("userHeader").setText(usr);
        this.getView().byId("titleDetail").setTitle("Dettaglio Consegna");
        this.getView()
          .byId("DDTHeader")
          .setText("DDT n° " + NumeroDDT);
        this.getView().byId("ConsegnaText").setText(Consegna);
        this.getView().byId("DataConsegna").setText(DataConsegna);
        this.getView().byId("NomeComm").setText(NomeComm);
        this.getView().byId("NomeDest").setText(NomeDest);
        this.getView().byId("CittaComm").setText(CittaComm);
        this.getView().byId("CittaDest").setText(CittaDest);
        this.getView().byId("CapComm").setText(CapComm);
        this.getView().byId("RegioComm").setText(RegioComm);
        this.getView().byId("ViaComm").setText(ViaComm);
        this.getView().byId("CapDest").setText(CapDest);
        this.getView().byId("RegioDest").setText(RegioDest);
        this.getView().byId("ViaDest").setText(ViaDest);
      },
      onLogout: function () {
        sessionStorage.clear();
        window.open("index.html", "_self");
      },

      onFilterInvoices: function (oEvent) {
        // build filter array
        var aFilter = [];
        var sQuery = oEvent.getParameter("query");
        if (sQuery) {
          aFilter.push(new Filter("Cliente", FilterOperator.Contains, sQuery));
        }

        // filter binding
        var oList = this.getView().byId("DDTList");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilter);
      },
      /* onPressItem: function(oEvent) {
             var oItem = oEvent.getSource();
             //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
             var itemclickednum = oItem.getBindingContext("DDT").getPath().substr(6);
             var itemclicked = oItem.getBindingContext("DDT").getModel().getData();
             var data = itemclicked.Data[itemclickednum];
             MessageToast.show(data.Cliente + ' - ' + data.DDTNumero);

         },*/
      onNavBack: function (oEvent) {
        sessionStorage.removeItem("NumeroDDT");
        sessionStorage.removeItem("Cliente");
        sap.ui.core.BusyIndicator.show();
        window.open("pod.html", "_self");
      },
      onPressPos: function (oEvent) {
        //sap.ui.core.BusyIndicator.show();
        var oItem = oEvent.getSource();
        //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        itemclickednum = oItem.getBindingContext("DDTPos").getPath().substr(9);
        var itemclicked = oItem
          .getBindingContext("DDTPos")
          .getModel()
          .getData();
        dataPress = itemclicked.results[itemclickednum];
        pressDialog = this.getView().byId("DialogPos");

        if (!pressDialog) {
          this.getView().destroyDependents();
          pressDialog = sap.ui.xmlfragment("Quickstart.view.DialogPos", this);
          this.getView().addDependent(pressDialog);
          //pressDialog.setModel(this.getView());
          sap.ui.getCore().byId("UM").setText(dataPress.UM);
          sap.ui.getCore().byId("Materiale").setText(dataPress.Materiale);
          sap.ui.getCore().byId("PosDialog").setText(dataPress.Posizione);
          sap.ui.getCore().byId("DDTDialog").setText(NumeroDDT);
          if (dataPress.DataCheckIn !== "00000000")
            sap.ui
              .getCore()
              .byId("DdHhCheckIn")
              .setValue(
                dataPress.DataCheckIn +
                  ", " +
                  dataPress.OraCheckIn.substring(0, 4)
              );
          //sap.ui.getCore().byId("DdHhCheckIn").setDisplayFormatType('short');
          if (dataPress.DataCheckOut !== "00000000")
            sap.ui
              .getCore()
              .byId("DdHhCheckOut")
              .setValue(
                dataPress.DataCheckOut +
                  ", " +
                  dataPress.OraCheckOut.substring(0, 4)
              );
          //sap.ui.getCore().byId("DdHhCheckOut").setDisplayFormatType('short');
          if (dataPress.DataArrivo !== "00000000")
            sap.ui
              .getCore()
              .byId("DdHhArrivo")
              .setValue(
                dataPress.DataArrivo +
                  ", " +
                  dataPress.OraArrivo.substring(0, 4)
              );
          //sap.ui.getCore().byId("DdHhArrivo").setDisplayFormatType('short');
          if (dataPress.DataPesata !== "00000000")
            sap.ui
              .getCore()
              .byId("DdHhPesata")
              .setValue(
                dataPress.DataPesata +
                  ", " +
                  dataPress.OraPesata.substring(0, 4)
              );
          //sap.ui.getCore().byId("DdHhPesata").setDisplayFormatType('short');
          sap.ui.getCore().byId("QtaCons").setText(dataPress.QtaConsegna);
          if (dataPress.PesoNetto == 0 || dataPress.PesoNetto == undefined) {
            sap.ui
              .getCore()
              .byId("PesoNetto")
              .setValue(dataPress.QtaConsegna.toString().trim());
          } else {
            sap.ui
              .getCore()
              .byId("PesoNetto")
              .setValue(dataPress.PesoNetto.toString().trim());
          }

          pressDialog.open();
        }
      },
      onClose: function () {
        pressDialog.close();
        pressDialog.destroy();
      },
      onSave: function () {
        var peso = sap.ui.getCore().byId("PesoNetto").getValue();
        var posizione = sap.ui.getCore().byId("PosDialog").getText();
        var DdArrivo = sap.ui
          .getCore()
          .byId("DdHhArrivo")
          .getValue()
          .split(", ")[0];
        var HhArrivo = sap.ui
          .getCore()
          .byId("DdHhArrivo")
          .getValue()
          .split(", ")[1];
        var DdPesata = sap.ui
          .getCore()
          .byId("DdHhPesata")
          .getValue()
          .split(", ")[0];
        var HhPesata = sap.ui
          .getCore()
          .byId("DdHhPesata")
          .getValue()
          .split(", ")[1];
        var DdCheckIn = sap.ui
          .getCore()
          .byId("DdHhCheckIn")
          .getValue()
          .split(", ")[0];
        var HhCheckIn = sap.ui
          .getCore()
          .byId("DdHhCheckIn")
          .getValue()
          .split(", ")[1];
        var DdCheckOut = sap.ui
          .getCore()
          .byId("DdHhCheckOut")
          .getValue()
          .split(", ")[0];
        var HhCheckOut = sap.ui
          .getCore()
          .byId("DdHhCheckOut")
          .getValue()
          .split(", ")[1];
        var UM = sap.ui.getCore().byId("UM").getText();
        var Note = sap.ui.getCore().byId("Note").getSelectedKey();

        if (
          HhArrivo == undefined ||
          HhPesata == undefined ||
          HhCheckIn == undefined ||
          HhCheckOut == undefined
        ) {
          MessageBox.error("Date e ore non inseriti");
          return;
        }
        var annoarrivo = DdArrivo.substring(0, 4);
        var mesearrivo = DdArrivo.substring(4, 6);
        var giornoarrivo = DdArrivo.substring(6, 8);
        var annopesata = DdPesata.substring(0, 4);
        var mesepesata = DdPesata.substring(4, 6);
        var giornopesata = DdPesata.substring(6, 8);
        var oraarrivo = HhArrivo.substring(0, 2);
        var minutiarrivo = HhArrivo.substring(2, 4);
        var orapesata = HhPesata.substring(0, 2);
        var minutipesata = HhPesata.substring(2, 4);
        //20201211 1011
        //20210112 1011
        if (
          annopesata < annoarrivo ||
          (annopesata == annoarrivo && mesepesata < mesearrivo) ||
          (annopesata == annoarrivo &&
            mesepesata == mesearrivo &&
            giornopesata < giornoarrivo) ||
          (annopesata == annoarrivo &&
            mesepesata == mesearrivo &&
            giornopesata == giornoarrivo &&
            orapesata < oraarrivo) ||
          (annopesata == annoarrivo &&
            mesepesata == mesearrivo &&
            giornopesata == giornoarrivo &&
            orapesata == oraarrivo &&
            minutipesata < minutiarrivo)
        ) {
          MessageBox.error(
            "Data e ora pesata devono essere\n successivi alla data e ora di arrivo"
          );
          return;
        }
        var annoCheckIn = DdCheckIn.substring(0, 4);
        var meseCheckIn = DdCheckIn.substring(4, 6);
        var giornoCheckIn = DdCheckIn.substring(6, 8);
        var annoCheckOut = DdCheckOut.substring(0, 4);
        var meseCheckOut = DdCheckOut.substring(4, 6);
        var giornoCheckOut = DdCheckOut.substring(6, 8);
        var oraCheckIn = HhCheckIn.substring(0, 2);
        var minutiCheckIn = HhCheckIn.substring(2, 4);
        var oraCheckOut = HhCheckOut.substring(0, 2);
        var minutiCheckOut = HhCheckOut.substring(2, 4);
        //20201211 1011
        //20210112 1011
        if (
          annoCheckOut < annoCheckIn ||
          (annoCheckOut == annoCheckIn && meseCheckOut < meseCheckIn) ||
          (annoCheckOut == annoCheckIn &&
            meseCheckOut == meseCheckIn &&
            giornoCheckOut < giornoCheckIn) ||
          (annoCheckOut == annoCheckIn &&
            meseCheckOut == meseCheckIn &&
            giornoCheckOut == giornoCheckIn &&
            oraCheckOut < oraCheckIn) ||
          (annoCheckOut == annoCheckIn &&
            meseCheckOut == meseCheckIn &&
            giornoCheckOut == giornoCheckIn &&
            oraCheckOut == oraCheckIn &&
            minutiCheckOut < minutiCheckIn)
        ) {
          MessageBox.error(
            "Data e ora Check Out devono\n essere successivi al Check In"
          );
          return;
        }
        sap.ui.core.BusyIndicator.show();
        var apigClient = apigClientFactory.newClient({
          apiKey: "zJjDPc92wx5XovVCpTEkY8QozlzcJAIz6Yl0G4ik"
        });
        var that = this;

        var params = {
          Authorization: "Basic c3NpaTpsaW1waW8=",
          "X-Requested-With": "X"
          //"path": path //'(Pwdob=\'POD\',Uname=\'SSII\',Pwd=\'DQ3PCyo37B\')',
        };
        var body =
          '<entry xml:base="/sap/opu/odata/sap/ZWEB_POD_SRV/" xmlns="http://www.w3.org/2005/Atom" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" ' +
          'xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices">' +
          '<content type="application/xml">' +
          "<m:properties>" +
          "<d:Consegna>" +
          Consegna +
          "</d:Consegna>" +
          "<d:Posizione>" +
          posizione +
          "</d:Posizione>" +
          "<d:DataCheckIn>" +
          DdCheckIn +
          "</d:DataCheckIn>" +
          "<d:OraCheckIn>" +
          HhCheckIn +
          "</d:OraCheckIn>" +
          "<d:DataCheckOut>" +
          DdCheckOut +
          "</d:DataCheckOut>" +
          "<d:OraCheckOut>" +
          HhCheckOut +
          "</d:OraCheckOut>" +
          "<d:DataArrivo>" +
          DdArrivo +
          "</d:DataArrivo>" +
          "<d:OraArrivo>" +
          HhArrivo +
          "</d:OraArrivo>" +
          "<d:DataPesata>" +
          DdPesata +
          "</d:DataPesata>" +
          "<d:OraPesata>" +
          HhPesata +
          "</d:OraPesata>" +
          "<d:PesoNetto>" +
          peso +
          "</d:PesoNetto>" +
          "<d:UM>" +
          UM +
          "</d:UM>" +
          "<d:Note>" +
          Note +
          "</d:Note>" +
          "</m:properties>" +
          "</content>" +
          "</entry>";

        apigClient
          .ZWEBPODSRVSave(params, body)
          .then(function (result) {
            MessageToast.show("Inserimento effettuato", {
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
            });
            var oModel = that.getView().getModel("DDTPos");
            oModel.setProperty(
              "/results/" + itemclickednum + "/PesoNetto",
              peso
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/DataCheckIn",
              DdCheckIn
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/OraCheckIn",
              HhCheckIn
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/DataCheckOut",
              DdCheckOut
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/OraCheckOut",
              HhCheckOut
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/DataArrivo",
              DdArrivo
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/OraArrivo",
              HhArrivo
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/DataPesata",
              DdPesata
            );
            oModel.setProperty(
              "/results/" + itemclickednum + "/OraPesata",
              HhPesata
            );
            oModel.refresh();
            sap.ui.core.BusyIndicator.hide();
            pressDialog.close();
            pressDialog.destroy();
          })
          .catch(function (result) {
            // Add error callback code here.
            sap.ui.core.BusyIndicator.hide();
            pressDialog.close();
            pressDialog.destroy();
            if (
              result.data !== undefined &&
              result.data.error.innererror !== undefined
            ) {
              setTimeout(function () {
                MessageToast.show("Errore nel caricamento dei dati", {
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
                });
                console.log(
                  "Code: ",
                  result.data.error.innererror.errordetails[1].code
                );
                console.log(
                  "Message: ",
                  result.data.error.innererror.errordetails[1].message
                );
              }, 500);
            } else {
              var oModel = that.getView().getModel("DDTPos");
              oModel.setProperty(
                "/results/" + itemclickednum + "/PesoNetto",
                peso
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/DataCheckIn",
                DdCheckIn
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/OraCheckIn",
                HhCheckIn
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/DataCheckOut",
                DdCheckOut
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/OraCheckOut",
                HhCheckOut
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/DataArrivo",
                DdArrivo
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/OraArrivo",
                HhArrivo
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/DataPesata",
                DdPesata
              );
              oModel.setProperty(
                "/results/" + itemclickednum + "/OraPesata",
                HhPesata
              );
              oModel.refresh();
            }
          });
      }
    });
  }
);
