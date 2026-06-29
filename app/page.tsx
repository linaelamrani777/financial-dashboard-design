import { FinanceProvider } from "@/components/finance-provider"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardBody } from "@/components/dashboard-body"

export default function Page() {
  return (
    <FinanceProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <DashboardHeader />
        <DashboardBody />
      </div>
    </FinanceProvider>
  )
}
