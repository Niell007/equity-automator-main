import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table'
import { Select } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { REPORT_TYPES, REPORT_CONFIG, type ReportType } from '@/config/features'
import { getReportConfig, isReportFormatSupported } from '@/utils/env'

interface Report {
  id: string
  type: ReportType
  name: string
  format: string
  status: 'generating' | 'completed' | 'failed'
  createdAt: string
  downloadUrl?: string
}

interface ComplianceReportsState {
  isLoading: boolean
  error: string | null
  reports: Report[]
  filters: {
    type: ReportType | 'all'
    format: string
    dateRange: {
      start: Date | null
      end: Date | null
    }
  }
  selectedTemplate: string
  isGenerating: boolean
}

export const ComplianceReports: React.FC = () => {
  const reportConfig = getReportConfig()
  const [state, setState] = useState<ComplianceReportsState>({
    isLoading: true,
    error: null,
    reports: [],
    filters: {
      type: 'all',
      format: reportConfig.generation.defaultFormat,
      dateRange: {
        start: null,
        end: null,
      },
    },
    selectedTemplate: Object.keys(REPORT_TYPES)[0] as ReportType,
    isGenerating: false,
  })

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulated data for demonstration
        setState(prev => ({
          ...prev,
          isLoading: false,
          reports: [
            {
              id: '1',
              type: 'COMPLIANCE_SUMMARY',
              name: 'Monthly Compliance Summary',
              format: 'pdf',
              status: 'completed',
              createdAt: new Date().toISOString(),
              downloadUrl: '#',
            },
            {
              id: '2',
              type: 'DOCUMENT_STATUS',
              name: 'Document Status Report',
              format: 'excel',
              status: 'completed',
              createdAt: new Date().toISOString(),
              downloadUrl: '#',
            },
            {
              id: '3',
              type: 'ACTIVITY_LOG',
              name: 'Activity Log Report',
              format: 'csv',
              status: 'generating',
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load reports',
        }))
      }
    }

    fetchReports()
  }, [])

  const handleGenerateReport = async () => {
    try {
      setState(prev => ({ ...prev, isGenerating: true }))
      // TODO: Implement report generation logic
      console.log('Generating report:', {
        type: state.selectedTemplate,
        format: state.filters.format,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to generate report',
      }))
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }))
    }
  }

  const handleDownload = async (report: Report) => {
    try {
      // TODO: Implement download logic
      console.log('Downloading report:', report.id)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to download report',
      }))
    }
  }

  const handleEmailReport = async (report: Report) => {
    try {
      // TODO: Implement email logic
      console.log('Emailing report:', report.id)
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to email report',
      }))
    }
  }

  const filteredReports = state.reports.filter(report => {
    if (state.filters.type !== 'all' && report.type !== state.filters.type) return false
    if (state.filters.format && report.format !== state.filters.format) return false
    if (state.filters.dateRange.start && new Date(report.createdAt) < state.filters.dateRange.start) return false
    if (state.filters.dateRange.end && new Date(report.createdAt) > state.filters.dateRange.end) return false
    return true
  })

  if (state.error) {
    return (
      <Alert variant="error" className="m-4">
        {state.error}
      </Alert>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Compliance Reports</h1>
        <Button
          variant="primary"
          disabled={state.isGenerating}
          onClick={handleGenerateReport}
        >
          <Icon name="plus" className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Generate New Report</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Report Type"
              value={state.selectedTemplate}
              onChange={(value) => setState(prev => ({
                ...prev,
                selectedTemplate: value as ReportType,
              }))}
              options={Object.entries(REPORT_TYPES).map(([key, value]) => ({
                label: value,
                value: key,
              }))}
            />
            <Select
              label="Format"
              value={state.filters.format}
              onChange={(value) => setState(prev => ({
                ...prev,
                filters: { ...prev.filters, format: value },
              }))}
              options={reportConfig.generation.availableFormats.map(format => ({
                label: format.toUpperCase(),
                value: format,
              }))}
            />
            {reportConfig.generation.enableEmail && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email-report"
                  className="form-checkbox"
                />
                <label htmlFor="email-report" className="text-sm">
                  Email report when complete
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Report History</h2>
            <div className="flex items-center space-x-4">
              <Select
                label="Filter by Type"
                value={state.filters.type}
                onChange={(value) => setState(prev => ({
                  ...prev,
                  filters: { ...prev.filters, type: value as ReportType | 'all' },
                }))}
                options={[
                  { label: 'All Types', value: 'all' },
                  ...Object.entries(REPORT_TYPES).map(([key, value]) => ({
                    label: value,
                    value: key,
                  })),
                ]}
              />
              <DatePicker
                label="Date Range"
                startDate={state.filters.dateRange.start}
                endDate={state.filters.dateRange.end}
                onChange={(start, end) => setState(prev => ({
                  ...prev,
                  filters: {
                    ...prev.filters,
                    dateRange: { start, end },
                  },
                }))}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Report Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{REPORT_TYPES[report.type]}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {report.format.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === 'completed'
                          ? 'success'
                          : report.status === 'generating'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {report.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(report)}
                          >
                            <Icon name="download" className="w-4 h-4" />
                          </Button>
                          {reportConfig.generation.enableEmail && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEmailReport(report)}
                            >
                              <Icon name="mail" className="w-4 h-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}