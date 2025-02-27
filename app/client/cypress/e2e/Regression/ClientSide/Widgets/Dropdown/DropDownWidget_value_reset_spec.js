const commonlocators = require("../../../../../locators/commonlocators.json");
import * as _ from "../../../../../support/Objects/ObjectsCore";

describe("Dropdown Widget Check value does not reset on navigation", function () {
  before(() => {
    cy.fixture("dropDownWidget_reset_check_dsl").then((val) => {
      _.agHelper.AddDsl(val);
    });
  });

  it("1. Check if the dropdown value does not change on navigation", function () {
    //Change the value of drop down;
    cy.wait(4000); //settling time for dsl into layout

    cy.get(commonlocators.selectButton).last().click();
    cy.selectWidgetOnClickOption("Red");
    cy.wait(200);

    //Navigate
    cy.NavigateToAPI_Panel();

    //Again navigate back to the widget
    _.entityExplorer.SelectEntityByName("Select3");

    //Check for the select value again
    cy.get(
      `.t--draggable-selectwidget .bp3-popover-target ${commonlocators.menuSelection}`,
    )
      .last()
      .should("have.text", "Red");
  });
});
