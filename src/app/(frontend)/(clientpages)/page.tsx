import { redirect } from "next/navigation";
import Home from "../(localpages)/homee/page";

export default function MainHomePage() {
  redirect(`/home`);
}
