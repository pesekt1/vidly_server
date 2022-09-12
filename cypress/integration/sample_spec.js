describe("Test 1", () => {
  it("Visits vidly server movies api", () => {
    cy.request("http://localhost:3900/api/movies");
  });
});

describe("Test 2", () => {
  it("Visits vidly client", () => {
    cy.visit("http://localhost:3000");
  });
});

describe("Test 3", () => {
  it("Visits vidly client login", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.url().should("include", "/login");
  });
});

describe("Login test", () => {
  it("Gives alert when logging in with incorrect password", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.get("#username").type("pesekt@gmail.com");
    cy.get("#password").type("wrong password");
    cy.get("button").contains("Login").click();
    cy.get(".alert").should("contain", "invaild email or password");
  });
});

describe("Test 5", () => {
  it("Visits vidly client login", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login").click();
    cy.url().should("include", "/login");
    cy.get("#username").type("pesekt@gmail.com");
    cy.get("#password").type("123456");
    cy.get("button").contains("Login").click();
    cy.url().should("not.contain", "/login");
    cy.get(".alert").should("not.exist");
  });
});
