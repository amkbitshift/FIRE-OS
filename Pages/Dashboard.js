import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Users, Calendar, Receipt, FileText, 
  TrendingUp, AlertCircle, CheckCircle2, Clock,
  Plus, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.list('-created_date'),
    initialData: [],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list('-created_date'),
    initialData: [],
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date'),
    initialData: [],
  });

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date'),
    initialData: [],
  });

  const stats = {
    totalJobs: jobs.length,
    incomplete: jobs.filter(j => j.status === 'incomplete').length,
    inProgress: jobs.filter(j => j.status === 'in_progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    clients: clients.length,
    invoices: invoices.length,
    reports: reports.length,
  };

  const upcomingJobs = jobs
    .filter(j => j.status !== 'completed')
    .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
    .slice(0, 5);

  const recentReports = reports.slice(0, 3);

  const statusColors = {
    incomplete: "bg-gray-100 text-gray-700 border-gray-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };

  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Here's your service overview.</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Schedule")}>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-200">
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-10 -translate-y-10 bg-orange-400 rounded-full opacity-10" />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalJobs}</div>
              <div className="flex gap-3 mt-3 text-xs">
                <span className="text-gray-500">{stats.incomplete} pending</span>
                <span className="text-blue-600">{stats.inProgress} active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Clients</CardTitle>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.clients}</div>
              <p className="text-xs text-gray-500 mt-2">Active clients</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Invoices</CardTitle>
                <Receipt className="w-5 h-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.invoices}</div>
              <p className="text-xs text-gray-500 mt-2">Generated invoices</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Reports</CardTitle>
                <FileText className="w-5 h-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.reports}</div>
              <p className="text-xs text-gray-500 mt-2">AI-generated reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Jobs - Takes 2 columns */}
          <Card className="lg:col-span-2 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Upcoming Jobs
                </CardTitle>
                <Link to={createPageUrl("Schedule")}>
                  <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {upcomingJobs.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming jobs scheduled</p>
                  <Link to={createPageUrl("Schedule")}>
                    <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule a Job
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="p-4 rounded-lg border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                            {job.priority && (
                              <Badge variant="secondary" className={`${priorityColors[job.priority]} text-xs`}>
                                {job.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(job.scheduled_date), "MMM d, yyyy")}
                            </span>
                            {job.location && (
                              <span className="truncate">{job.location}</span>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className={statusColors[job.status]}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Recent Reports */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-lg border-2 border-orange-100">
              <CardHeader className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
                <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Link to={createPageUrl("Schedule")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-orange-50 hover:border-orange-200">
                    <Calendar className="w-4 h-4 mr-3" />
                    Schedule Job
                  </Button>
                </Link>
                <Link to={createPageUrl("Clients")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 hover:border-blue-200">
                    <Users className="w-4 h-4 mr-3" />
                    Add Client
                  </Button>
                </Link>
                <Link to={createPageUrl("Reports")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 hover:border-purple-200">
                    <FileText className="w-4 h-4 mr-3" />
                    Generate Report
                  </Button>
                </Link>
                <Link to={createPageUrl("Invoices")} className="block">
                  <Button variant="outline" className="w-full justify-start hover:bg-green-50 hover:border-green-200">
                    <Receipt className="w-4 h-4 mr-3" />
                    Create Invoice
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card className="shadow-lg">
              <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {recentReports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No reports yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div 
                        key={report.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all"
                      >
                        <p className="font-medium text-sm text-gray-900 truncate">{report.client_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(report.inspection_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}