/// <reference types="Cypress" />

const commonlocators = require("../../../../../locators/commonlocators.json");
const widgetsPage = require("../../../../../locators/Widgets.json");
const dsl = require("../../../../../fixtures/listdsl.json");
import * as _ from "../../../../../support/Objects/ObjectsCore";

describe("Container Widget Functionality", function () {
  const items = JSON.parse(dsl.dsl.children[0].listData);

  before(() => {
    cy.fixture("listdsl").then((val) => {
      _.agHelper.AddDsl(val);
    });
  });

  it("1. ListWidget-Copy & Delete Verification", function () {
    //Copy Chart and verify all properties
    _.propPane.CopyWidgetFromPropertyPane("List1");
    _.propPane.DeleteWidgetFromPropertyPane("List1Copy");
    _.deployMode.DeployApp();
    // Verify the copied list widget is deleted
    cy.get(commonlocators.containerWidget).should("have.length", 2);
    _.deployMode.NavigateBacktoEditor();
  });

  it("2. List widget background colour and deploy ", function () {
    // Open Property pane
    _.entityExplorer.SelectEntityByName("List1", "Widgets");

    cy.moveToStyleTab();
    // Scroll down to Styles and Add background colour
    cy.selectColor("backgroundcolor");
    cy.wait(1000);
    cy.selectColor("itembackgroundcolor");
    // Click on Deploy and ensure it is deployed appropriately
    _.deployMode.DeployApp();
    // Ensure List Background Color
    cy.get(widgetsPage.listWidget).should(
      "have.css",
      "background-color",
      "rgb(126, 34, 206)",
    );
    // Verify List Item Background Color
    cy.get(widgetsPage.itemContainerWidget).should(
      "have.css",
      "background-color",
      "rgb(126, 34, 206)",
    );
    _.deployMode.NavigateBacktoEditor();
  });

  it("3. Toggle JS - List widget background colour and deploy ", function () {
    // Open Property pane
    _.entityExplorer.SelectEntityByName("List1", "Widgets");

    cy.moveToStyleTab();
    // Scroll down to Styles and Add background colour
    cy.get(widgetsPage.backgroundColorToggleNew).click({ force: true });
    cy.testJsontext("backgroundcolor", "#FFC13D");
    cy.wait(1000);
    cy.get(widgetsPage.itemBackgroundColorToggle).click({ force: true });
    cy.testJsontext("itembackgroundcolor", "#38AFF4");
    // Click on Deploy and ensure it is deployed appropriately
    _.deployMode.DeployApp();
    // Ensure List Background Color
    cy.get(widgetsPage.listWidget).should(
      "have.css",
      "background-color",
      "rgb(255, 193, 61)",
    );
    // Verify List Item Background Color
    cy.get(widgetsPage.itemContainerWidget).should(
      "have.css",
      "background-color",
      "rgb(56, 175, 244)",
    );
    _.deployMode.NavigateBacktoEditor();
  });

  it("4. Add new item in the list widget array object", function () {
    // Open Property pane
    _.entityExplorer.SelectEntityByName("List1", "Widgets");

    //Add the new item in the list
    _.propPane.UpdatePropertyFieldValue(
      "Items",
      JSON.stringify(this.dataSet.ListItems),
    );
    cy.wait(2000);
    _.deployMode.DeployApp();
    _.deployMode.NavigateBacktoEditor();
  });

  it("5. Adding large item Spacing for item card", function () {
    // Open Property pane
    _.entityExplorer.SelectEntityByName("List1", "Widgets");
    _.propPane.MoveToTab("Style");
    // Scroll down to Styles and Add item spacing for item card
    cy.testJsontext("itemspacing\\(" + "px" + "\\)", 12);
    cy.wait(2000);
    // Click on Deploy and ensure it is deployed appropriately
    _.deployMode.DeployApp();
    _.deployMode.NavigateBacktoEditor();
  });

  it("6. Renaming the widget from Property pane and Entity explorer ", function () {
    // Open Property pane
    _.entityExplorer.SelectEntityByName("List1", "Widgets");

    // Change the list widget name from property pane and Verify it
    cy.widgetText(
      "List2",
      widgetsPage.listWidgetName,
      widgetsPage.widgetNameSpan,
    );
    // Change the list widget name from Entity Explorer
    cy.renameEntity("List2", "List1");
    // Mouse over to list name
    _.entityExplorer.SelectEntityByName("List1");

    cy.get(widgetsPage.listWidgetName)
      .first()
      .trigger("mouseover", { force: true });
    // Verify the list name is changed
    cy.contains(
      widgetsPage.listWidgetName + " " + commonlocators.listWidgetNameTag,
      "List1",
    );
    _.deployMode.DeployApp();
    _.deployMode.NavigateBacktoEditor();
  });
});
