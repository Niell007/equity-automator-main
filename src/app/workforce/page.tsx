import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataTable } from "@/components/ui/data-table"
import { Download, Upload, Plus, Search } from "lucide-react"

// Define the Employee type
type Employee = {
  id: string
  name: string
  position: string
  department: string
  gender: string
  race: string
  startDate: string
  status: "active" | "inactive" | "on_leave"
}

// Sample data
const employees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    position: "Software Engineer",
    department: "Engineering",
    gender: "Male",
    race: "White",
    startDate: "2023-01-15",
    status: "active",
  },
  // Add more sample data as needed
]

// Define table columns
const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "race",
    header: "Race",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return (
        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
          ${status === "active" ? "bg-green-100 text-green-800" :
            status === "inactive" ? "bg-gray-100 text-gray-800" :
            "bg-yellow-100 text-yellow-800"}`}>
          {status}
        </div>
      )
    },
  },
]

export default function WorkforcePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Workforce Management</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <DataTable
          columns={columns}
          data={employees}
        />
      </div>
    </div>
  )
} 