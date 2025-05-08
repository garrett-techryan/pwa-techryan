export const msalConfig = {
    auth: {
      clientId: "14d267d0-19e0-4103-8cfa-1a7e9f0b4cc1", // from Azure portal
      authority: "https://login.microsoftonline.com/d72ae6fa-03a7-4ccb-888c-64613b1d665b",
      redirectUri: "http://localhost:3000",
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: false,
    },
  };

  export const loginRequest = {
    scopes: ["User.Read"], // adjust as needed
  };
  