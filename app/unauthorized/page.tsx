"use client";

import { useRouter } from "next/navigation";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="error-box">
      <div >
        <h1>🚫 Unauthorized</h1>
        <p>You don’t have access to this page.</p>

        <button className="btn btn-edit" onClick={() => router.push("/blogs")}>
          Go To Blogs Page
        </button>
      </div>
    </div>
  );
}
