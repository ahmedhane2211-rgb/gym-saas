import React, { useContext, useMemo } from "react";
import {
  Users,
  TrendingUp,
  ClipboardCheck,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity,
  Target,
  Zap,
  Users2,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { LanguageContext } from "../../shared/context/LanguageContext";
import { useGetDashboardStatsQuery } from "../services/DashboardSlice";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Dashboard = () => {
  const { t, i18n } = useContext(LanguageContext);
  const isRtl = i18n.language === "ar";
  const { data: apiResponse, isLoading } = useGetDashboardStatsQuery();

  const dashboardData = apiResponse?.data;

  // Process Revenue Data
  const revenueData = useMemo(() => {
    const labels =
      dashboardData?.monthlyRevenue?.map((item) => item.month) || [];
    const data =
      dashboardData?.monthlyRevenue?.map((item) => Number(item.income)) || [];

    return {
      labels:
        labels.length > 0
          ? labels
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          fill: true,
          label: t("monthly_income"),
          data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#FF6B00",
          backgroundColor: "rgba(255, 107, 0, 0.1)",
          tension: 0.4,
          pointBackgroundColor: "#FF6B00",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [dashboardData, t]);

  // Process Attendance Data
  const attendanceData = useMemo(() => {
    const labels =
      dashboardData?.weeklyAttendance?.map((item) => {
        const date = new Date(item.day);
        return date.toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", {
          weekday: "short",
        });
      }) || [];
    const data =
      dashboardData?.weeklyAttendance?.map((item) => Number(item.count)) || [];

    return {
      labels:
        labels.length > 0
          ? labels
          : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: t("attendance"),
          data: data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#3B82F6",
          borderRadius: 8,
          barThickness: 20,
        },
      ],
    };
  }, [dashboardData, i18n.language, t]);

  // Process Membership Distribution
  const membershipData = useMemo(() => {
    const labels =
      dashboardData?.plansDistribution?.map((item) => item.plan_name) || [];
    const data =
      dashboardData?.plansDistribution?.map((item) =>
        Number(item.subscriber_count),
      ) || [];

    return {
      labels: labels.length > 0 ? labels : [t("no_data")],
      datasets: [
        {
          data: data.length > 0 ? data : [1],
          backgroundColor: [
            "#FFD700",
            "#C0C0C0",
            "#FF6B00",
            "#3B82F6",
            "#8B5CF6",
            "#EC4899",
          ],
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    };
  }, [dashboardData, t]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleFont: { size: 12, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 10 } },
      },
      y: {
        grid: { color: "rgba(156, 163, 175, 0.1)", drawBorder: false },
        ticks: { color: "#9CA3AF", font: { size: 10 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#9CA3AF",
          font: { size: 11, weight: "bold" },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-main p-1 lg:p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            {t("dashboard")}{" "}
            <span className="text-orange">{t("analytics")}</span>
          </h1>
          <p className="text-gray-500 text-sm font-bold mt-1">
            {new Date().toLocaleDateString(
              i18n.language === "ar" ? "ar-EG" : "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </p>
        </div>
        {/* <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
                        <Calendar size={16} className="text-orange" />
                        {t('last_30_days')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-orange/20 hover:scale-105 transition-all">
                        <TrendingUp size={16} />
                        {t('export_report')}
                    </button>
                </div> */}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("total_members")}
          value={dashboardData?.summary?.total_members || 0}
          trend="+0%"
          isUp={true}
          icon={<Users className="text-blue" />}
          bgColor="bg-blue/10"
        />
        <StatCard
          title={t("monthly_income")}
          value={`${Number(dashboardData?.summary?.monthly_revenue || 0).toLocaleString()} EGP`}
          trend="+0%"
          isUp={true}
          icon={<TrendingUp className="text-green-500" />}
          bgColor="bg-green-500/10"
        />
        <StatCard
          title={t("attendance_today")}
          value={dashboardData?.summary?.attendance_today || 0}
          trend="+0%"
          isUp={true}
          icon={<Activity className="text-orange" />}
          bgColor="bg-orange/10"
        />
        <StatCard
          title={t("active_subscriptions")}
          value={dashboardData?.summary?.active_subscriptions || 0}
          trend="+0%"
          isUp={true}
          icon={<Zap className="text-purple-500" />}
          bgColor="bg-purple-500/10"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase ">
                {t("revenue_growth")}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {t("yearly_overview")}
              </p>
            </div>
            <div className="p-2 bg-orange/10 rounded-lg text-orange">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex-1">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        {/* Membership Distribution */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase ">
                {t("membership_plans")}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {t("active_distribution")}
              </p>
            </div>
            <div className="p-2 bg-blue/10 rounded-lg text-blue">
              <Target size={20} />
            </div>
          </div>
          <div className="flex-1 relative">
            <Doughnut data={membershipData} options={doughnutOptions} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pt-8">
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                {dashboardData?.summary?.active_subscriptions || 0}
              </p>
              <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                {t("total")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Attendance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Attendance Bar Chart */}
        <div className="lg:col-span-1 glass-card p-6 min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase ">
                {t("attendance_velocity")}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {t("weekly_stats")}
              </p>
            </div>
            <div className="p-2 bg-orange/10 rounded-lg text-orange">
              <ClipboardCheck size={20} />
            </div>
          </div>
          <div className="flex-1">
            <Bar data={attendanceData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Activities Terminal */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase ">
                {t("live_terminal")}
              </h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                {t("recent_users")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                {t("live_now")}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {dashboardData?.recentLogins?.length > 0 ? (
              dashboardData.recentLogins.map((user, idx) => (
                <div
                  key={user.id || idx}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl group hover:border-orange/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-gray-200 dark:border-white/10 shadow-sm">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.full_name}`}
                        alt=""
                      />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase ">
                        {user.full_name}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-widest ${
                        user.role === "admin" ? "bg-orange" : "bg-blue"
                      }`}
                    >
                      {user.role}
                    </span>
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowUpRight size={14} className="text-orange" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 font-bold uppercase tracking-widest text-xs">
                {t("no_recent_activity")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, isUp, icon, bgColor }) => (
  <div className="glass-card p-6 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
    {/* Background Glow */}
    <div
      className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-all ${bgColor}`}
    />

    <div className="flex justify-between items-start mb-4 relative z-10">
      <div
        className={`p-3 rounded-2xl ${bgColor} shadow-sm group-hover:rotate-12 transition-transform`}
      >
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-lg ${isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
      >
        {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        <span className="text-[10px] font-black uppercase tracking-tighter">
          {trend}
        </span>
      </div>
    </div>

    <div className="space-y-1 relative z-10">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        {title}
      </p>
      <h4 className="text-3xl font-black text-gray-900 dark:text-white  tracking-tighter">
        {value}
      </h4>
    </div>
  </div>
);

export default Dashboard;
