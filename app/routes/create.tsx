import { LoaderArgs } from "@remix-run/node";
import { generateQRCode } from "~/utils/qr_generator";
import { useLoaderData } from "@remix-run/react";
import { create_token } from "~/utils/create_token";

export const loader = async ({ request }: LoaderArgs) => {
  // const body = await request.json();
  const base64String = await generateQRCode("http://yasdsaa.ru");
  let payloadPromise = await create_token();

  console.log(payloadPromise);

  // console.log(process.env.BASE_URL);
  return base64String;
};

export default Create = () => {
  const base64 = useLoaderData();

  return <img src={base64} />;
}