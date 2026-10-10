
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Analytics.css";

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTrendData(habits, days) {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateKey = getDateKey(date);

    const completed = habits.filter(
      (habit) => habit.completed?.[dateKey]
    ).length;

    const percentage = habits.length
      ? Math.round((completed / habits.length) * 100)
      : 0;

    data.push({
      day:
        days === 7
          ? date.toLocaleDateString("en-US", {
              weekday: "short",
            })
          : date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
      completed,
      percentage,
    });
  }

  return data;
}

function getWeeklyData(habits) {
  return getTrendData(habits, 7);
}

function Analytics({ habits, selectedDate }) {
  const [trendRange, setTrendRange] = useState("week");

  // Weekly bar chart data
  const weeklyData = getWeeklyData(habits);

  // Consistency trend data: 7 days or 30 days
  const trendData = getTrendData(
    habits,
    trendRange === "week" ? 7 : 30
  );

  // Selected-date completion data for the donut chart
  const selectedDateKey =
    typeof selectedDate === "string"
      ? selectedDate
      : getDateKey(new Date(selectedDate));

  const completedCount = habits.filter(
    (habit) => habit.completed?.[selectedDateKey]
  ).length;

  const remainingCount = Math.max(
    0,
    habits.length - completedCount
  );

  const completionData = [
    {
      name: "Completed",
      value: completedCount,
    },
    {
      name: "Remaining",
      value: remainingCount,
    },
  ];

  const donutColors = ["#A78BFA", "#E9E3F5"];

  return (
    <section className="analytics-section">
      <div className="analytics-heading">
        <div>
          <h2>Habit Analytics</h2>
          <p>See your progress and consistency over time.</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Weekly Completion Bar Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Overview</h3>
          </div>

          <p className="chart-description">
            Completed habits each day
          </p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{
                  top: 10,
                  right: 8,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chart-grid, #eee8f5)"
                />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, Math.max(1, habits.length)]}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Completed habits",
                  ]}
                  contentStyle={{
                    background: "var(--tooltip-bg, #ffffff)",
                    border: "1px solid var(--chart-grid, #eee8f5)",
                    borderRadius: "10px",
                    color: "var(--chart-text, #393344)",
                  }}
                />

                <Bar
                  dataKey="completed"
                  fill="#A78BFA"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={34}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Trend Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Consistency Trend</h3>

            <select
              className="trend-select"
              value={trendRange}
              onChange={(event) =>
                setTrendRange(event.target.value)
              }
              aria-label="Consistency trend date range"
            >
              <option value="week">1 Week</option>
              <option value="month">1 Month</option>
            </select>
          </div>

          <p className="chart-description">
            Daily habit completion percentage
          </p>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{
                  top: 10,
                  right: 12,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chart-grid, #eee8f5)"
                />

                <XAxis
                  dataKey="day"
                  interval="preserveStartEnd"
                  minTickGap={12}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Completion",
                  ]}
                  contentStyle={{
                    background: "var(--tooltip-bg, #ffffff)",
                    border: "1px solid var(--chart-grid, #eee8f5)",
                    borderRadius: "10px",
                    color: "var(--chart-text, #393344)",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#F59EBD"
                  strokeWidth={3}
                  dot={{
                    r: trendRange === "week" ? 4 : 2,
                    fill: "#F59EBD",
                    strokeWidth: 0,
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Date Donut Chart */}
        <div className="chart-card donut-card">
          <div className="chart-header">
            <h3>Today's Progress</h3>
          </div>

          <p className="chart-description">
            Habit completion for the selected date
          </p>

          <div className="chart-container donut-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  stroke="none"
                >
                  {completionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={donutColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name,
                  ]}
                  contentStyle={{
                    background: "var(--tooltip-bg, #ffffff)",
                    border: "1px solid var(--chart-grid, #eee8f5)",
                    borderRadius: "10px",
                    color: "var(--chart-text, #393344)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <strong>
                {habits.length
                  ? Math.round(
                      (completedCount / habits.length) * 100
                    )
                  : 0}
                %
              </strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="donut-legend">
            <div>
              <span
                className="legend-dot"
                style={{ background: donutColors[0] }}
              />
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>

            <div>
              <span
                className="legend-dot"
                style={{ background: donutColors[1] }}
              />
              <span>Remaining</span>
              <strong>{remainingCount}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;