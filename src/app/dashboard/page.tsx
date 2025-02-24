'use client'

import { Users, FileCheck, AlertTriangle, FileText } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Employees",
      value: "2,850",
      change: "+12.5%",
      description: "Active employees in system",
      icon: Users
    },
    {
      title: "Compliance Score",
      value: "92%",
      change: "+4.75%",
      description: "Overall compliance rating",
      icon: FileCheck
    },
    {
      title: "Action Items",
      value: "12",
      change: "-2",
      description: "Tasks requiring attention",
      icon: AlertTriangle
    },
    {
      title: "Reports Generated",
      value: "145",
      change: "+28.4%",
      description: "Total reports this month",
      icon: FileText
    }
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employment Equity Dashboard</h1>
        <Button variant="outline">Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold">{stat.value}</h2>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Activity content will go here */}
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          {/* Deadlines content will go here */}
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Company Workforce Profile</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Import</Button>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {/* Spreadsheet component will be integrated here */}
        </div>
      </Card>
    </div>
  )
} 