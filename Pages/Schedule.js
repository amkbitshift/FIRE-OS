import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Plus, MapPin, User, Clock, ArrowRight, X } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function Schedule() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    scheduled_date: '',
    scheduled_time: '',
    status: 'incomplete',
    assigned_to: '',
    priority: 'medium',
    equipment_type: '',
    notes: '',
    client_id: '',
  });

  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.list('-scheduled_date'),
    initialData: [],
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
    initialData: [],
  });

  const createJobMutation = useMutation({
    mutationFn: (jobData) => base44.entities.Job.create(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowForm(false);
      resetForm();
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Job.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      scheduled_date: '',
      scheduled_time: '',
      status: 'incomplete',
      assigned_to: '',
      priority: 'medium',
      equipment_type: '',
      notes: '',
      client_id: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createJobMutation.mutate(formData);
  };

  const cycleStatus = (job) => {
    const statusFlow = {
      incomplete: 'in_progress',
      in_progress: 'completed',
      completed: 'incomplete',
    };
    const newStatus = statusFlow[job.status];
    updateJobMutation.mutate({ 
      id: job.id, 
      data: { ...job, status: newStatus } 
    });
  };

  const statusColors = {
    incomplete: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
    completed: "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
  };

  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
  };

  const groupedJobs = {
    incomplete: jobs.filter(j => j.status === 'incomplete'),
    in_progress: jobs.filter(j => j.status === 'in_progress'),
    completed: jobs.filter(j => j.status === 'completed'),
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Schedule</h1>
            <p className="text-gray-600 mt-1">Manage and track all field service jobs</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Schedule Job
          </Button>
        </div>

        {/* Status Board */}
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(groupedJobs).map(([status, statusJobs]) => (
            <Card key={status} className="shadow-lg">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="text-lg font-bold flex items-center justify-between">
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  <Badge variant="secondary" className="bg-white">
                    {statusJobs.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <AnimatePresence>
                  {statusJobs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No jobs</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {statusJobs.map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h3 className="font-semibold text-gray-900 text-sm">{job.title}</h3>
                            {job.priority && (
                              <Badge variant="secondary" className={`${priorityColors[job.priority]} text-xs`}>
                                {job.priority}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-2 text-xs text-gray-600 mb-3">
                            {job.scheduled_date && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(job.scheduled_date), "MMM d, yyyy")}
                                {job.scheduled_time && ` at ${job.scheduled_time}`}
                              </div>
                            )}
                            {job.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{job.location}</span>
                              </div>
                            )}
                            {job.assigned_to && (
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                {job.assigned_to}
                              </div>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cycleStatus(job)}
                            className={`w-full ${statusColors[job.status]} border-2 font-medium`}
                          >
                            {job.status === 'incomplete' && 'Start Job'}
                            {job.status === 'in_progress' && 'Complete Job'}
                            {job.status === 'completed' && 'Reopen Job'}
                            <ArrowRight className="w-3 h-3 ml-2" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Job Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-orange-500" />
                Schedule New Job
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Fire Alarm Inspection"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={formData.client_id}
                    onValueChange={(value) => setFormData({...formData, client_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scheduled_date">Date *</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    required
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="scheduled_time">Time</Label>
                  <Input
                    id="scheduled_time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({...formData, priority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assigned_to">Assigned To</Label>
                  <Input
                    id="assigned_to"
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                    placeholder="Technician name"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Job site address"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="equipment_type">Equipment Type</Label>
                  <Input
                    id="equipment_type"
                    value={formData.equipment_type}
                    onChange={(e) => setFormData({...formData, equipment_type: e.target.value})}
                    placeholder="e.g., Fire Alarm System, Sprinkler System"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Job details and requirements"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  disabled={createJobMutation.isPending}
                >
                  {createJobMutation.isPending ? 'Scheduling...' : 'Schedule Job'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}