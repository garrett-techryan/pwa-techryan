export const msalConfig = {
    auth: {
      clientId: "127a58c5-6c66-4035-83f1-6e0f078c4576", // from Azure portal
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
  