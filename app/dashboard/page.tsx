"use client";

import Card from "../../components/Card";
import { FiUser, FiCheck,FiActivity } from "react-icons/fi";
import "../../styles/dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface BlogCategory {
  _id: string;
  count: number;
}

interface DashboardStats {
  totalusers: number;
  totalactiveUsers: number;
  totalblogs: number;
  latestUser: any[];
  BlogsBycategories: BlogCategory[];
}

interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchStats = async () => {
      try {
        const res = await axios.get<DashboardResponse>(
          `${BACKEND_URL}/api/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };

    fetchStats();
  }, []);


  if (!stats) {
    return <Loader/>
  }

  return (
    <div className="dashboard-container">
      <div className="cards-grid">
        <Card
          title="Total Users"
          value={stats.stats.totalusers}
          icon={<FiUser />}
          color="#D4AF75"
        />

        <Card
          title="Active Users"
          value={stats.stats.totalactiveUsers}
          icon={<FiCheck />}
          color="#D4AF75"
        />
        <Card
            title="Total Blogs"
            value={stats.stats.totalblogs}
            icon={<FiActivity />}
            color="#D4AF75"
        />
      </div>
    </div>
  );
}
