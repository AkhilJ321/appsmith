import {
  assertHelper,
  agHelper,
  propPane,
  locators,
  deployMode,
  entityExplorer,
} from "../../../../support/Objects/ObjectsCore";

describe("Validate basic binding of Input widget to Input widget", () => {
  before(() => {
    cy.fixture("inputBindingdsl").then((val: any) => {
      agHelper.AddDsl(val);
    });
  });

  it("1. Input widget test with default value for atob method", () => {
    cy.fixture("testdata").then(function (dataSet: any) {
      entityExplorer.SelectEntityByName("Input1", "Widgets");
      propPane.UpdatePropertyFieldValue(
        "Default value",
        dataSet.atobInput + "}}",
      );
      assertHelper.AssertNetworkStatus("@updateLayout");
      cy.get(locators._inputWidget)
        .first()
        .invoke("attr", "value")
        .should("equal", "A"); //Before mapping JSObject value of input
      //Input widget test with default value for btoa method"
      entityExplorer.SelectEntityByName("Input2");
      propPane.UpdatePropertyFieldValue(
        "Default value",
        dataSet.btoaInput + "}}",
      );
    });
    assertHelper.AssertNetworkStatus("@updateLayout");
    cy.get(locators._inputWidget)
      .last()
      .invoke("attr", "value")
      .should("equal", "QQ=="); //Before mapping JSObject value of input
  });

  it("2. Publish and validate the data displayed in input widgets value for aToB and bToa", function () {
    deployMode.DeployApp(locators._widgetInputSelector("inputwidgetv2"));
    cy.get(locators._widgetInputSelector("inputwidgetv2"))
      .first()
      .invoke("attr", "value")
      .should("contain", "A");
    cy.get(locators._widgetInputSelector("inputwidgetv2"))
      .last()
      .invoke("attr", "value")
      .should("contain", "QQ==");
  });
});
