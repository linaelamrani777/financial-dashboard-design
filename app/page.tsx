import { FinanceProvider } from "@/components/finance-provider"
import { ErpShell } from "@/components/erp/erp-shell"

export default function Page() {
  return (
    <FinanceProvider>
      <ErpShell />
    </FinanceProvider>
  )
}
