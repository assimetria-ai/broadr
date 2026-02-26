import { Header } from '../../components/@system/Header/Header'
import { PageLayout } from '../../components/@system/layout/PageLayout'

export function HomePage() {
  return (
    <PageLayout>
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your app.</p>
        {/* @custom — add your dashboard content here */}
      </main>
    </PageLayout>
  )
}
