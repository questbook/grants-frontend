import { Metadata } from "./googleRecoveryTypes";

/**
 * Manually upload a simple text file to drive using fetch request.
 * @param metadata the metadata of the file to upload.
 * @param fileContent the content (text) of the file.
 * @returns a promise indicating whether the file has been successfully uploaded.
 */
export const uploadTextFileToDrive = async (
  metadata: Metadata,
  fileContent: string
) => {
  const file = new Blob([fileContent], { type: "text/plain" });
  const accessToken = gapi.auth.getToken().access_token;
  const form = new FormData();
  form.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  form.append("file", file);

  return fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    {
      method: "POST",
      headers: new Headers({ Authorization: "Bearer " + accessToken }),
      body: form,
    }
  );
};

/**
 * upload google script with the options async and defer.
 * @param src the source script to be loaded.
 * @returns a promise indicating whether the script was loaded or not.
 */
export const loadGoogleScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });
};

export const getRandomString = (stringLength: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*~";
  const charactersLength = characters.length;
  for (let i = 0; i < stringLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const _isNumber = (numberString: string): boolean => {
  return /^[1-9]\d*$/.test(numberString);
};