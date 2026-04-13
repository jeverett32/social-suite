import type { Metadata } from "next";
import { LoginClient } from "./login-client";

export const metadata: Metadata = {
  title: "Krowdr — Access",
  description: "Demo access for the Krowdr product flow.",
};

export default function LoginPage() {
  return <LoginClient />;
}
