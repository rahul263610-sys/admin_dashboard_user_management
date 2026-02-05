"use client";

import Card from "../../components/Card";
import { FiUser, FiCheck,FiActivity } from "react-icons/fi";
import "../../styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { User } from "../../components/types/user";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BlogCategory {
  _id: string;
  count: number;
}

interface DashboardStats {
  totalusers: number;
  totalactiveUsers: number;
  totalblogs: number;
  latestUser: User[];
  BlogsBycategories: BlogCategory[];
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const res = await axios.get<DashboardResponse>(
          `${BACKEND_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
      if (res.data.success) {
        setStats(res.data);
      } else {
        setError("Failed to load dashboard data");
      }
      } catch (err: any) {
          console.log("Dashboard API handled error:", err.response?.data?.message);
          if (err.response) {
            setError(err.response.data?.message || "Server error occurred");
          } else if (err.request) {
            setError("No response from server. Please try again.");
          } else {
            setError("Unexpected error occurred.");
          }
      }
      finally {
        setLoading(false);
      }
};

    fetchStats();
  }, []);

  if (loading) return <Loader />;

if (error)
  return (
    <>
      <Breadcrumb pageName="Dashboard" />
      <div className="error-box">
        <h2>⚠️ Failed to load dashboard</h2>
        <p>{error}</p>
      </div>
    </>
  );

  
 return (
  <>
    <Breadcrumb pageName="Dashboard" />
    <div className="dashboard-container">
      <div className="cards-grid">
        <Card
          title="Total Users"
          value={stats?.stats.totalusers ?? 0}
          icon={<FiUser />}
          color="#D4AF75"
        />
        <Card
          title="Active Users"
          value={stats?.stats.totalactiveUsers ?? 0}
          icon={<FiCheck />}
          color="#D4AF75"
        />
        <Card
          title="Total Blogs"
          value={stats?.stats.totalblogs ?? 0}
          icon={<FiActivity />}
          color="#D4AF75"
        />
      </div>
    </div>
    <div className="table-card">
      <h4 className="table-title">Latest Users</h4>

      <div className="table-wrapper">
        <div className="table-head">
          <div>User Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Joined</div>
        </div>

        {stats?.stats.latestUser?.map((user: User) => (
          <div className="table-row" key={user._id}>
            <div className="user-cell">
              <img
                src={user.avatar || "/images/user/user_avatar.jpg"}
                alt={user.name}
                className="user-avatar"
              />
              <span>{user.name}</span>
            </div>

            <div className="email-cell">{user.email}</div>

            <div className={`role-badge ${user.role}`}>{user.role}</div>

            <div
              className={`status-badge ${
                user.status === "1"
                  ? "active"
                  : "inactive"
              }`}
            >
              { user.status === "1" ? "Active" : "Inactive"}
            </div>

            <div className="date-cell">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
      <div className="table-footer">
        <span
          className="see-more-link"
          onClick={() => router.push("/users")}
        >
          See more users →
        </span>
      </div>
    </div>

  </>
);

}
