import { redirect } from "next/navigation";

export default function RootRedirect() {
  // Splash'ı zorunlu kıl: / → /intro
  redirect("/intro");
}
