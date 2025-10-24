import React, { useEffect, useState } from "react";
import { supabase } from "../config/supabase";

const Dashboard = () => {
  // HARDCODED ADMIN CREDENTIALS
  const ADMIN_EMAIL = "admin@momo.com";
  const ADMIN_PASSWORD = "123123123";

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  // Dashboard States
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState({ total: 0, approved: 0, pending: 0 });
  const [approving, setApproving] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError(null);

    console.log("🔐 Login attempt...");

    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      console.log("✅ Login successful!");
      setIsLoggedIn(true);
      setLoginEmail("");
      setLoginPassword("");
      fetchAlumni();
    } else {
      console.error("❌ Invalid credentials");
      setLoginError("❌ Invalid email or password. Please try again.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    console.log("🚪 Logging out...");
    setIsLoggedIn(false);
    setAlumni([]);
    setCounts({ total: 0, approved: 0, pending: 0 });
    setLoginEmail("");
    setLoginPassword("");
    setError(null);
    setSuccessMessage(null);
  };

  // Fetch all alumni data
  const fetchAlumni = async () => {
    try {
      console.log("📥 Fetching alumni data...");
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("alumni_directory")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        throw fetchError;
      }

      if (!data || data.length === 0) {
        console.log("⚠️ No data found");
        setAlumni([]);
        setCounts({ total: 0, approved: 0, pending: 0 });
        setLoading(false);
        return;
      }

      console.log("✅ Data fetched:", data.length, "records");

      const total = data.length;
      const approved = data.filter((a) => a.status === "approved").length;
      const pending = data.filter((a) => a.status === "pending").length;

      setCounts({ total, approved, pending });
      setAlumni(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching alumni:", err);
      setError(err.message || "Failed to load alumni data. Please refresh the page.");
      setLoading(false);
    }
  };

  // Approve a pending user
  const handleApprove = async (id) => {
    try {
      setApproving(id);
      setError(null);
      console.log("🔄 Approving alumni record:", id);

      // Perform the update
      const { data: updateData, error: updateError } = await supabase
        .from("alumni_directory")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select();

      if (updateError) {
        console.error("❌ Update error:", updateError);
        console.error("Full error object:", JSON.stringify(updateError, null, 2));
        console.error("Error details:", {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint,
          status: updateError.status,
        });
        throw new Error(`Update failed: ${updateError.message || JSON.stringify(updateError)}`);
      }

      if (!updateData) {
        console.warn("⚠️ Update returned no data");
      }

      console.log("✅ Update successful:", updateData);
      console.log("📊 Alumni record ID updated:", id);

      // Update local state immediately
      setAlumni((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "approved", updated_at: new Date().toISOString() }
            : a
        )
      );

      // Update counts
      setCounts((prev) => ({
        ...prev,
        approved: prev.approved + 1,
        pending: prev.pending - 1,
      }));

      setSuccessMessage("✅ User approved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("❌ Error approving alumni:", err);
      setError(err.message || "Failed to approve user. Please try again.");
    } finally {
      setApproving(null);
    }
  };

  // ===== RENDER LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Alumni Directory Management</p>
            </div>

            {/* Login Error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-sm">{loginError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@momo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold mt-6"
              >
                🔐 Login
              </button>
            </form>

            {/* Demo Credentials */}
            {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</p>
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> admin@momo.com
              </p>
              <p className="text-sm text-blue-800">
                <strong>Password:</strong> 123123123
              </p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER DASHBOARD SCREEN =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              👤 Welcome, <span className="font-semibold text-blue-600">{ADMIN_EMAIL}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            🚪 Logout
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <p className="text-green-800 font-medium">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-xl"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading alumni data...</p>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-medium text-gray-600">Total Users</h3>
                <p className="text-3xl font-bold text-blue-700 mt-2">{counts.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-medium text-gray-600">Approved</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">{counts.approved}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-lg font-medium text-gray-600">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{counts.pending}</p>
              </div>
            </div>

            {/* Pending Approvals Table */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Pending Approvals ({counts.pending})
                </h2>
                <button
                  onClick={fetchAlumni}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  🔄 Refresh
                </button>
              </div>

              {counts.pending === 0 ? (
                <p className="text-gray-500 text-center py-8 text-lg">
                  All alumni are approved ✅
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Graduation
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Company
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {alumni
                        .filter((a) => a.status === "pending")
                        .map((a) => (
                          <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {a.full_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{a.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {a.graduation_year || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {a.company || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => handleApprove(a.id)}
                                disabled={approving === a.id}
                                className={`px-4 py-2 rounded-lg font-medium text-white text-sm transition ${
                                  approving === a.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                                }`}
                              >
                                {approving === a.id ? "⏳ Approving..." : "✓ Approve"}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;