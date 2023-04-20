import qrcode from "qrcode";

export const generateQRCode = async (text: string): Promise<string> => {
  const options = {
    width: 400,
    height: 400,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF"
    }
  };
  return qrcode.toDataURL(text, options);
};
