import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, FileText, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

export default function Reports() {
  const [formData, setFormData] = useState({
    job_id: '',
    client_name: '',
    technician_name: '',
    inspection_date: new Date().toISOString().split('T')[0],
    equipment_type: '',
    equipment_location: '',
    findings: '',
    actions_taken: '',
    parts_used: '',
    test_results: '',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const queryClient = useQueryClient();

  const { data: reports = [] } = useQuery({
    queryKey: ['reports'],
    queryFn: () => base44.entities.Report.list('-created_date'),
    initialData: [],
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => base44.entities.Job.list(),
    initialData: [],
  });

  const createReportMutation = useMutation({
    mutationFn: (reportData) => base44.entities.Report.create(reportData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const prompt = `You are a professional fire protection engineer writing a detailed service report.

Generate a comprehensive, narrative-style fire service report based on the following inspection data:

**Client:** ${formData.client_name}
**Technician:** ${formData.technician_name}
**Inspection Date:** ${formData.inspection_date}
**Equipment Type:** ${formData.equipment_type}
**Location:** ${formData.equipment_location}

**Findings:**
${formData.findings}

**Actions Taken:**
${formData.actions_taken}

**Parts Used:**
${formData.parts_used}

**Test Results:**
${formData.test_results}

Please generate:

1. **Professional Service Report** - A well-structured narrative report including:
    - Executive summary
    - Detailed findings and observations
    - Work performed
    - Test results and compliance
    - Equipment condition assessment
    
2. **Pros & Cons Analysis** - Professional analysis of:
    - Positive aspects of the system/inspection
    - Areas of concern or improvement needed
    
3. **Recommendations for Next Service** - Actionable recommendations for:
    - Future maintenance needs
    - Preventive measures
    - Timeline for next inspection
    - Priority items

Format the response professionally with clear sections and markdown formatting.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
      });

      const reportData = {
        ...formData,
        generated_report: result,
      };

      await createReportMutation.mutateAsync(reportData);
      setGeneratedReport(result);
    } catch (error) {
      console.error("Error generating report:", error);
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateReport();
  };

  const resetForm = () => {
    setFormData({
      job_id: '',
      client_name: '',
      technician_name: '',
      inspection_date: new Date().toISOString().split('T')[0],
      equipment_type: '',
      equipment_location: '',
      findings: '',
      actions_taken: '',
      parts_used: '',
      test_results: '',
    });
    setGeneratedReport(null);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            AI Report Generation
          </h1>
          <p className="text-gray-600 mt-1">Transform field data into professional service reports</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="shadow-lg border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-500" />
                Inspection Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="job">Related Job (Optional)</Label>
                  <Select
                    value={formData.job_id}
                    onValueChange={(value) => setFormData({...formData, job_id: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title} - {format(new Date(job.scheduled_date), "MMM d")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name">Client Name *</Label>
                    <Input
                      id="client_name"
                      required
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      placeholder="ABC Corporation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="technician_name">Technician Name *</Label>
                    <Input
                      id="technician_name"
                      required
                      value={formData.technician_name}
                      onChange={(e) => setFormData({...formData, technician_name: e.target.value})}
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="inspection_date">Inspection Date *</Label>
                  <Input
                    id="inspection_date"
                    type="date"
                    required
                    value={formData.inspection_date}
                    onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment_type">Equipment Type *</Label>
                    <Input
                      id="equipment_type"
                      required
                      value={formData.equipment_type}
                      onChange={(e) => setFormData({...formData, equipment_type: e.target.value})}
                      placeholder="Fire Alarm System"
                    />
                  </div>

                  <div>
                    <Label htmlFor="equipment_location">Location *</Label>
                    <Input
                      id="equipment_location"
                      required
                      value={formData.equipment_location}
                      onChange={(e) => setFormData({...formData, equipment_location: e.target.value})}
                      placeholder="Building A, 2nd Floor"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="findings">Findings *</Label>
                  <Textarea
                    id="findings"
                    required
                    value={formData.findings}
                    onChange={(e) => setFormData({...formData, findings: e.target.value})}
                    placeholder="Describe what you found during inspection..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="actions_taken">Actions Taken *</Label>
                  <Textarea
                    id="actions_taken"
                    required
                    value={formData.actions_taken}
                    onChange={(e) => setFormData({...formData, actions_taken: e.target.value})}
                    placeholder="Describe the work performed..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="parts_used">Parts Used</Label>
                  <Textarea
                    id="parts_used"
                    value={formData.parts_used}
                    onChange={(e) => setFormData({...formData, parts_used: e.target.value})}
                    placeholder="List any parts or materials used..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="test_results">Test Results</Label>
                  <Textarea
                    id="test_results"
                    value={formData.test_results}
                    onChange={(e) => setFormData({...formData, test_results: e.target.value})}
                    placeholder="Record test results and measurements..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Report
                      </>
                    )}
                  </Button>
                  {generatedReport && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      New Report
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Generated Report */}
          <Card className="shadow-lg border-2 border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                {generatedReport ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Generated Report
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 text-gray-400" />
                    Report Preview
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="w-16 h-16 text-purple-500 animate-spin mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    AI is working its magic...
                  </h3>
                  <p className="text-gray-500">
                    Generating your professional service report
                  </p>
                </div>
              ) : generatedReport ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-600 mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc ml-6 mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal ml-6 mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-600">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-gray-800">{children}</strong>,
                    }}
                  >
                    {generatedReport}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-500">
                    Fill in the inspection details and click "Generate AI Report"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <Card className="mt-8 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.slice(0, 6).map((report) => (
                  <div 
                    key={report.id}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-200 hover:shadow-md transition-all bg-white"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{report.client_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Equipment: {report.equipment_type}</p>
                      <p>Date: {format(new Date(report.inspection_date), "MMM d, yyyy")}</p>
                      <p className="text-xs text-gray-500 mt-2">By: {report.technician_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}