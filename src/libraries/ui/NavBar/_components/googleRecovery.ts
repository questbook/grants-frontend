import { Wallet } from "ethers";
import React from "react";
import { loadGoogleScript, uploadTextFileToDrive } from './googleRecoveryUtils';
import { Metadata } from './googleRecoveryTypes'

interface Props {
  googleClientID: string;
}

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const ZERO_WALLET_FOLDER_NAME = ".zero-wallet";
const ZERO_WALLET_FILE_NAME = "key";

export default function useGoogleDriveWalletRecoveryReact({ googleClientID }: Props) {
  const [tokenClient, setTokenClient] = React.useState<any>();
  const [gapiInited, setGapiInited] = React.useState(false);
  const [gisInited, setGisInited] = React.useState(false);
  const [exportLoading, setExportLoading] = React.useState(false);
  const [importLoading, setImportLoading] = React.useState(false);

  function gapiInit() {
    gapi.client.init({}).then(function () {
      // Load drive api library.
      gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/drive/v3/rest")
        .then(() => {
          setGapiInited(true);
        });
        
    });
  }

  React.useEffect(() => {
    // Loading GAPI and GSI

    const srcGapi = "https://apis.google.com/js/api.js";
    const srcGsi = "https://accounts.google.com/gsi/client";

    loadGoogleScript(srcGapi)
      .then(() => {
        gapi.load("client", gapiInit);
      })
      .catch(console.error);

    loadGoogleScript(srcGsi)
      .then(() => {
        try {
          const newToken = google.accounts.oauth2.initTokenClient({
            client_id: googleClientID,
            scope: SCOPES.join(" "),
            callback: () => {}, // defined at request time
          });
          setTokenClient(newToken);
          setGisInited(true);
        } catch {}
      })
      .catch(console.error);
  }, [googleClientID]);

  async function getToken(err: any) {
    if (
      err.result.error.code.toString() === "401" ||
      err.result.error.code.toString() === "403"
    ) {
      // The access token is missing, invalid, or expired, prompt for user consent to obtain one.
      await new Promise((resolve, reject) => {
        try {
          // Settle this promise in the response callback for requestAccessToken()
          tokenClient.callback = (resp: any) => {
            if (resp.error !== undefined) {
              reject(resp);
            }
            // GIS has automatically updated gapi.client with the newly issued access token.
            // console.log(
            //   "gapi.client access token: " +
            //     JSON.stringify(gapi.client.getToken())
            // );
            resolve(resp);
          };
          tokenClient.requestAccessToken();
        } catch (err) {
          // console.log(err);
        }
      });
    } else {
      // Errors unrelated to authorization: server errors, exceeding quota, bad requests, and so on.
      throw new Error(err);
    }
  }

  const _importWalletFromGD = async () => {
    const folderQuerySelector: string = `mimeType=\'application/vnd.google-apps.folder\' and name=\'${ZERO_WALLET_FOLDER_NAME}\' and \'root\' in parents and trashed = false`;

    const folderQueryResponse = await gapi.client.drive.files.list({
      q: folderQuerySelector,
      spaces: "drive",
    });

    if (
      !folderQueryResponse.result.files ||
      !folderQueryResponse.result.files.length
    )
      throw Error("No zero wallet folder found in GD.");
    const zeroWalletFolderId = folderQueryResponse.result.files[0].id!;
    const keyFileQuerySelector: string = `mimeType!=\'application/vnd.google-apps.folder\' and \'${zeroWalletFolderId}\' in parents and name=\'${ZERO_WALLET_FILE_NAME}\' and trashed = false`;
    const keyFileQueryResponse = await gapi.client.drive.files.list({
      q: keyFileQuerySelector,
      spaces: "drive",
    });

    if (keyFileQueryResponse.result.files?.length === 0)
      throw Error("No key files found.");
    if (keyFileQueryResponse.result.files?.length !== 1)
      throw Error("Found multiple key files.");

    const keyFileId = keyFileQueryResponse.result.files[0].id!;

    // GET file content
    const keyFileContent = await gapi.client.drive.files.get({
      fileId: keyFileId,
      alt: "media",
    });

    try {
      const newWallet = new Wallet(keyFileContent.body);
      return newWallet;
    } catch {
      throw Error("Content is not a valid private key");
    }
  };

  const importWalletFromGD = async () => {
    if (exportLoading) throw new Error("Already processing export.");
    if (importLoading) throw new Error("Already processing import.");
    if (!gapiInited) throw new Error("GAPI is not loaded.");
    if (!gisInited) throw new Error("GSI is not loaded.");
    setImportLoading(true);
    let newWallet;
    let error: string = "unknown error";
    try {
      newWallet = await _importWalletFromGD();
      error = "";
    } catch (err) {
      if (typeof err === "string") {
        error = err.toUpperCase();
      } else if (err instanceof Error) {
        error = err.message;
      }
      try {
        await getToken(err);
        try {
          newWallet = await _importWalletFromGD();
          error = "";
        } catch (err2) {
          if (typeof err2 === "string") {
            error = err2.toUpperCase();
          } else if (err2 instanceof Error) {
            error = err2.message;
          }
        }
      } catch {}
    }
    setImportLoading(false);
    if (!newWallet) throw new Error(error.toString());
    return newWallet;
  };

  const _exportWalletToGD = async (wallet: Wallet) => {
    // Creating .zero-wallet folder or getting it from drive
    let zeroWalletFolderId: string;
    const folderQuerySelector: string = `mimeType=\'application/vnd.google-apps.folder\' and name=\'${ZERO_WALLET_FOLDER_NAME}\' and \'root\' in parents and trashed = false`;
    const folderQueryResponse = await gapi.client.drive.files.list({
      q: folderQuerySelector,
      spaces: "drive",
    });


    // @TODO handle if there are multiple folders with the name of ZERO_WALLET_FOLDER_NAME.
    // @TODO A customized ID can be used to identify the correct folder.
    // @TODO Maybe remove all ZERO_WALLET_FOLDER_NAME folders
    if (folderQueryResponse.result.files?.length) {
      zeroWalletFolderId = folderQueryResponse.result.files[0].id!;

      // Removing the old ZERO_WALLET_FILE_NAME file.
      // @TODO read the last key file id and add a new file with id + 1
      const keyFileQuerySelector: string = `mimeType!=\'application/vnd.google-apps.folder\' and \'${zeroWalletFolderId}\' in parents and name=\'${ZERO_WALLET_FILE_NAME}\' and trashed = false`;
      const keyFileQueryResponse = await gapi.client.drive.files.list({
        q: keyFileQuerySelector,
        spaces: "drive",
      });

      // removing all key files
      if (keyFileQueryResponse.result.files)
        await Promise.all(
          keyFileQueryResponse.result.files.map((elem) => {
            const oldKeyFileId = elem.id!;
            return gapi.client.drive.files.delete({ fileId: oldKeyFileId });
          })
        );
    } else {
      const folderMetadata: gapi.client.drive.File = {
        name: ZERO_WALLET_FOLDER_NAME,
        mimeType: "application/vnd.google-apps.folder",
      };

      const newZeroWalletFolder = await gapi.client.drive.files.create({
        resource: folderMetadata,
      });
      zeroWalletFolderId = newZeroWalletFolder.result.id!;
    }


    const keyFileMetadata: Metadata = {
      name: ZERO_WALLET_FILE_NAME,
      parents: [zeroWalletFolderId],
      mimeType: "application/octet-stream",
    };

    await uploadTextFileToDrive(keyFileMetadata, wallet!.privateKey);
  };

  const exportWalletToGD = async (wallet: Wallet) => {
    if (exportLoading) throw new Error("Already processing export.");
    if (importLoading) throw new Error("Already processing import.");
    if (!gapiInited) throw new Error("GAPI is not loaded.");
    if (!gisInited) throw new Error("GSI is not loaded.");
    setExportLoading(true);

    let newFileID;
    let error = "unkown error";
    try {
      newFileID = await _exportWalletToGD(wallet);
      error = "";
    } catch (err) {
      if (typeof err === "string") {
        error = err.toUpperCase();
      } else if (err instanceof Error) {
        error = err.message;
      }
      try {
        await getToken(err);
        try {
          newFileID = await _exportWalletToGD(wallet);
          error = "";
        } catch (err2) {
          if (typeof err2 === "string") {
            error = err2.toUpperCase();
          } else if (err2 instanceof Error) {
            error = err2.message;
          }
        }
      } catch {}
    }
    setExportLoading(false);
    if (error.length > 0) throw new Error(error.toString());
    return newFileID;
  };

  function revokeToken() {
    let cred = gapi.client.getToken();
    if (cred !== null) {
      google.accounts.oauth2.revoke(cred.access_token, () => {
        // console.log("Revoked: " + cred.access_token);
      });
      gapi.client.setToken(null);
    }
  }

  return {
    inited: gapiInited && gisInited,
    loading: exportLoading || importLoading,
    importWalletFromGD,
    exportWalletToGD,
  };
}