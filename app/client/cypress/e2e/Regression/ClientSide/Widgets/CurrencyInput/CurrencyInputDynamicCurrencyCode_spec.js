import * as _ from "../../../../../support/Objects/ObjectsCore";

const widgetName = "currencyinputwidget";

describe("Currency input widget - ", () => {
  before(() => {
    cy.fixture("CurrencyInputDynamic").then((val) => {
      _.agHelper.AddDsl(val);
    });
  });

  it("1. Should show empty dropdown for a typo", () => {
    cy.openPropertyPane(widgetName);

    // Turn on allowCurrencyChange
    cy.get(".t--property-control-allowcurrencychange label")
      .last()
      .click({ force: true });
    // Click on the currency change option
    cy.get(".t--input-currency-change")
      .first()
      .click({ force: true })
      .wait(200);
    // Search with a typo
    cy.get(".t--search-input input").type("gdp");
    cy.wait(500);
    // Assert the options dropdown is still open
    cy.get(".t--search-input input").should("be.visible");

    _.deployMode.DeployApp();
    // Click on the currency change option
    cy.get(".t--input-currency-change")
      .first()
      .click({ force: true })
      .wait(200);
    // Search with a typo
    cy.get(".t--search-input input").type("gdp");
    cy.wait(500);
    // Assert the options dropdown is still open
    cy.get(".t--search-input input").should("be.visible");
    // Back to the editor
    _.deployMode.NavigateBacktoEditor();
  });

  it("2. should check that widget can be used with dynamic default currency code", () => {
    cy.openPropertyPane(widgetName);
    cy.get(".t--property-control-currency .CodeMirror-code").should(
      "contain",
      "{{appsmith.store.test}}",
    );
    cy.get(".t--input-currency-change")
      .first()
      .click({ force: true })
      .wait(200);
    cy.get(".t--search-input input").type("gbp");
    cy.wait(500);
    cy.get(".t--dropdown-option").last().click();
    cy.get(".t--property-control-currency .CodeMirror-code").should(
      "contain",
      "{{appsmith.store.test}}",
    );
    _.deployMode.DeployApp();
    cy.get(".bp3-button.select-button").click({ force: true });
    cy.get(".menu-item-text").first().click({ force: true });
    cy.get(".t--widget-textwidget").should("contain", "USD:AS:USD");
    cy.get(".t--input-currency-change").should("contain", "$");
    cy.get(".bp3-button.select-button").click({ force: true });
    cy.get(".menu-item-text").last().click({ force: true });
    cy.get(".t--widget-textwidget").should("contain", "INR:IN:INR");
    cy.get(".t--input-currency-change").should("contain", "₹");
  });
});
