"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>🚫 Unauthorized</h1>
        <p>You don’t have access to this page.</p>

        <button onClick={() => router.push("/blogs")}>
          Go To Blogs Page
        </button>
      </div>
    </div>
  );
}
