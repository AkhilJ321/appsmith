const queryEditor = require("../../../../locators/QueryEditor.json");
const widgetsPage = require("../../../../locators/Widgets.json");
const publish = require("../../../../locators/publishWidgetspage.json");
const testdata = require("../../../../fixtures/testdata.json");
import {
  entityExplorer,
  agHelper,
  dataSources,
} from "../../../../support/Objects/ObjectsCore";
let datasourceName;

describe("Addwidget from Query and bind with other widgets", function () {
  before(() => {
    cy.fixture("inputdsl").then((val) => {
      agHelper.AddDsl(val);
    });
  });

  beforeEach(() => {
    cy.startRoutesForDatasource();
  });

  it("1. Create a PostgresDataSource", () => {
    dataSources.CreateDataSource("Postgres");
    dataSources.CreateQueryAfterDSSaved("SELECT * FROM configs LIMIT 10;");
    //Create a query and populate response by choosing addWidget and validate in Table Widget", () => {
    // Mock the response for this test
    cy.intercept("/api/v1/actions/execute", {
      fixture: "addWidgetTable-mock",
    });

    cy.onlyQueryRun();
    cy.xpath(queryEditor.queryResponse)
      .first()
      .invoke("text")
      .then((text) => {
        const tableRowTxt = text;
        cy.get(queryEditor.suggestedTableWidget).click();
        entityExplorer.SelectEntityByName("Table1");
        cy.isSelectRow(1);
        cy.readTableV2dataPublish("1", "0").then((tabData) => {
          const tabValue = tabData;
          cy.log("the value is" + tabValue);
          expect(tabValue).to.be.equal("5");
          expect(tableRowTxt).to.equal(tabValue);
        });
      });
  });

  it("2. Input widget test with default value from table widget", () => {
    entityExplorer.SelectEntityByName("Input1");
    cy.get(widgetsPage.defaultInput).type(testdata.addInputWidgetBinding);
    cy.wait("@updateLayout").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );
    //validation of data displayed in input widget based on row data selected
    cy.isSelectRow(1);
    cy.readTableV2dataPublish("1", "0").then((tabData) => {
      const tabValue = tabData;
      cy.log("the value is" + tabValue);
      expect(tabValue).to.be.equal("5");
      cy.isSelectRow(1);
      cy.get(publish.inputWidget + " " + "input")
        .first()
        .invoke("attr", "value")
        .should("contain", tabValue);
    });
  });

  it("3. Input widget test with default value from table widget[Bug#4136]", () => {
    entityExplorer.SelectEntityByName("Table1", "Widgets");
    cy.get(".t--property-pane-title").click({ force: true });
    cy.get(".t--property-pane-title")
      .type("TableUpdated", { delay: 300 })
      .type("{enter}");
    cy.wait("@updateWidgetName").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );
  });
});
