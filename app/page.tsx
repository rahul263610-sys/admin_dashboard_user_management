import Card from "../components/Card";
import { FiUser, FiCheck, FiActivity, FiStar, FiPlus } from "react-icons/fi";
import '../styles/dashboard.css'

export default function DashboardPage() {
  return (
      <div className="dashboard-container">
        <div className="cards-grid">
          <Card title="Total Users" value={12} icon={<FiUser />} color="#D4AF75" />
          <Card title="Active Users" value={8} icon={<FiCheck />} color="#D4AF75" />
        </div>
      </div>
  );
}
