const publish = require("../../../../locators/publishWidgetspage.json");
const testdata = require("../../../../fixtures/testdata.json");
import {
  agHelper,
  entityExplorer,
} from "../../../../support/Objects/ObjectsCore";

describe("Binding the Table and input Widget", function () {
  before(() => {
    cy.fixture("formInputTableV2Dsl").then((val) => {
      agHelper.AddDsl(val);
    });
  });

  it("1. Input widget test with default value from table widget", function () {
    entityExplorer.ExpandCollapseEntity("Form1");
    entityExplorer.SelectEntityByName("Input1", "Widgets");
    cy.testJsontext("defaultvalue", testdata.defaultInputWidget + "}}");

    cy.wait("@updateLayout").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );
  });

  it("2. validation of data displayed in input widgets based on sorting", function () {
    entityExplorer.SelectEntityByName("Table1");

    cy.testJsontext("defaultselectedrow", "0");
    cy.get(".draggable-header").contains("id").click({ force: true });
    cy.wait(1000);
    cy.readTableV2dataPublish("0", "0").then((tabData) => {
      const tabValue = tabData;
      expect(tabValue).to.be.equal("6788734");
      cy.log("the value is" + tabValue);
      cy.get(publish.inputWidget + " " + "input")
        .first()
        .invoke("attr", "value")
        .should("contain", tabValue);
    });
    cy.get(".draggable-header").contains("id").click({ force: true });
    cy.wait(1000);
    cy.readTableV2dataPublish("0", "0").then((tabData) => {
      const tabValue = tabData;
      expect(tabValue).to.be.equal("2381224");
      cy.log("the value is" + tabValue);
      cy.get(publish.inputWidget + " " + "input")
        .first()
        .invoke("attr", "value")
        .should("contain", tabValue);
    });
  });

  it("3. validation of column id displayed in input widgets based on sorted column", function () {
    entityExplorer.SelectEntityByName("Input1");

    cy.testJsontext("defaultvalue", testdata.sortedColumn + "}}");
    cy.wait("@updateLayout").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );
    cy.get(publish.inputWidget + " " + "input")
      .first()
      .invoke("attr", "value")
      .should("contain", "id");
  });
});
