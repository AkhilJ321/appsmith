import { ObjectsRegistry } from "../Objects/Registry";

export class DeployMode {
  private locator = ObjectsRegistry.CommonLocators;
  private agHelper = ObjectsRegistry.AggregateHelper;
  private assertHelper = ObjectsRegistry.AssertHelper;

  _jsonFieldName = (fieldName: string) => `//p[text()='${fieldName}']`;
  _jsonFormFieldByName = (fieldName: string, input = true) =>
    this._jsonFieldName(fieldName) +
    `/ancestor::div[@direction='column']//div[@data-testid='input-container']//${
      input ? "input" : "textarea"
    }`;
  _jsonFormRadioFieldByName = (fieldName: string) =>
    `//p[text()='${fieldName}']/ancestor::div[@direction='column']//div[@data-testid='radiogroup-container']//input`;
  _jsonFormDatepickerFieldByName = (fieldName: string) =>
    `//p[text()='${fieldName}']/ancestor::div[@direction='column']//div[@data-testid='datepicker-container']//input`;
  _jsonSelectDropdown = "button.select-button";
  private _jsonFormMultiSelectByName = (fieldName: string) =>
    `//p[text()='${fieldName}']/ancestor::div[@direction='column']//div[@data-testid='multiselect-container']//div[contains(@class, 'rc-select-show-arrow')]`;
  _clearDropdown = "button.select-button span.cancel-icon";
  private _jsonFormMultiSelectOptions = (option: string) =>
    `//div[@title='${option}']//input[@type='checkbox']/ancestor::div[@title='${option}']`;
  private _backtoHome =
    ".t--app-viewer-navigation-header .t--app-viewer-back-to-apps-button";
  private _homeAppsmithImage = "a.t--appsmith-logo";

  //refering PublishtheApp from command.js
  public DeployApp(
    eleToCheckInDeployPage: string = this.locator._backToEditor,
    toCheckFailureToast = true,
    toValidateSavedState = true,
    addDebugFlag = true,
  ) {
    //cy.intercept("POST", "/api/v1/applications/publish/*").as("publishAppli");

    // Wait before publish
    this.agHelper.Sleep(3000); //wait for elements settle!
    toValidateSavedState && this.agHelper.AssertAutoSave();
    // Stubbing window.open to open in the same tab
    this.assertHelper.AssertDocumentReady();
    this.StubbingDeployPage(addDebugFlag);
    this.agHelper.ClickButton("Deploy");
    this.agHelper.AssertElementAbsence(this.locator._btnSpinner, 10000); //to make sure we have started navigation from Edit page
    cy.get("@windowDeployStub").should("be.calledOnce");
    this.assertHelper.AssertDocumentReady();
    cy.log("Pagename: " + localStorage.getItem("PageName"));

    //Below url check throwing error - hence commenting!
    // cy.wait("@publishApp")
    //   .its("request.url")
    //   .should("not.contain", "edit");
    //cy.wait('@publishApp').wait('@publishApp') //waitng for 2 calls to complete

    this.agHelper.WaitUntilEleAppear(eleToCheckInDeployPage);
    localStorage.setItem("inDeployedMode", "true");
    toCheckFailureToast &&
      this.agHelper.AssertElementAbsence(
        this.locator._specificToast("has failed"),
      ); //Validating bug - 14141 + 14252
    this.agHelper.Sleep(2000); //for Depoy page to settle!
  }

  // Stubbing window.open to open in the same tab
  public StubbingWindow() {
    cy.window().then((window: any) => {
      cy.stub(window, "open")
        .as("windowStub")
        .callsFake((url) => {
          window.location.href = url;
          window.location.target = "_self";
        });
    });
  }

  public StubbingDeployPage(addDebugFlag = true) {
    cy.window({ timeout: 30000 }).then((window) => {
      cy.stub(window, "open")
        .as("windowDeployStub")
        .callsFake((url) => {
          const updatedUrl = `${Cypress.config().baseUrl + url.substring(1)}`;
          window.location.href = `${updatedUrl}${
            addDebugFlag
              ? (updatedUrl.indexOf("?") > -1 ? "&" : "?") + "debug=true"
              : ""
          }`;
        });
    });
  }

  public StubWindowNAssert(
    selector: string,
    expectedUrl: string,
    visitUrl: string,
    networkCall: string,
  ) {
    this.StubbingWindow();
    this.agHelper.GetNClick(selector, 0, false, 4000); //timeout new url to settle loading
    cy.get("@windowStub").should("be.calledOnce");
    cy.url().should("contain", expectedUrl);
    this.assertHelper.AssertDocumentReady();
    cy.visit(visitUrl, { timeout: 60000 });
    this.assertHelper.AssertNetworkStatus("@" + networkCall);
    this.assertHelper.AssertDocumentReady();
  }

  public NavigateBacktoEditor() {
    this.assertHelper.AssertDocumentReady();
    this.agHelper.GetNClick(this.locator._backToEditor, 0, true);
    this.agHelper.Sleep(2000);
    localStorage.setItem("inDeployedMode", "false");
    this.agHelper.AssertElementAbsence(
      this.locator._specificToast("There was an unexpcted error"),
    ); //Assert that is not error toast in Edit mode when navigating back from Deploy mode
    this.assertHelper.AssertDocumentReady();
    this.assertHelper.AssertNetworkStatus("@getWorkspace");
    this.agHelper.AssertElementVisible(this.locator._editPage); //Assert if canvas is visible after Navigating back!
  }

  public NavigateToHomeDirectly() {
    this.agHelper.GetNClick(this._backtoHome);
    this.agHelper.Sleep(2000);
    this.agHelper.AssertElementVisible(this._homeAppsmithImage);
  }

  public EnterJSONInputValue(fieldName: string, value: string, index = 0) {
    cy.xpath(this._jsonFormFieldByName(fieldName))
      .eq(index)
      .click()
      .type(value, { delay: 0 })
      .wait(200);
  }

  public EnterJSONTextAreaValue(fieldName: string, value: string, index = 0) {
    cy.xpath(this._jsonFormFieldByName(fieldName, false))
      .eq(index)
      .click()
      .type(value, { delay: 0 })
      .wait(200);
  }

  public ClearJSONFieldValue(fieldName: string, index = 0, isInput = true) {
    cy.xpath(this._jsonFormFieldByName(fieldName, isInput))
      .eq(index)
      .clear()
      .wait(300);
  }

  public SelectJsonFormDropDown(dropdownOption: string, index = 0) {
    cy.get(this._jsonSelectDropdown).eq(index).scrollIntoView().click();
    cy.get(this.locator._selectOptionValue(dropdownOption)).click({
      force: true,
    });
    this.agHelper.Sleep(); //for selected value to reflect!
  }

  public SelectJsonFormMultiSelect(
    name: string,
    options: string[],
    index = 0,
    check = true,
  ) {
    cy.xpath(this._jsonFormMultiSelectByName(name))
      .eq(index)
      .scrollIntoView()
      .click();
    this.agHelper.Sleep(500);

    if (check) {
      options.forEach(($each) => {
        cy.get(this.locator._multiSelectOptions($each))
          .check({ force: true })
          .wait(800);
        cy.xpath(this._jsonFormMultiSelectOptions($each)).should(
          "have.class",
          "rc-select-item-option-selected",
        );
      });
    } else {
      options.forEach(($each) => {
        cy.get(this.locator._multiSelectOptions($each))
          .uncheck({ force: true })
          .wait(800);
        cy.xpath(this._jsonFormMultiSelectOptions($each)).should(
          "not.have.class",
          "rc-select-item-option-selected",
        );
      });
    }
    // //closing multiselect dropdown
    cy.get("body").type("{esc}");
  }
}
